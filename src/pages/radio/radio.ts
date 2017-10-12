import { ViewController, Platform, NavController, Events } from 'ionic-angular';
import { Component }                from '@angular/core';
import { TranslateService }         from "ng2-translate";
import { InitService }              from '../../providers/init-service';
import { RadioService }             from '../../providers/radio-service';
import { GlobalService }            from '../../providers/global-service';
import { PromptService }            from "../../providers/prompt-service";
import { TrackerService }           from "../../providers/tracker-service";
import { BackgroundMode }                                   from "@ionic-native/background-mode";
import { MusicControls }                                    from '@ionic-native/music-controls';
import { GoogleAnalytics }                                  from '@ionic-native/google-analytics';
import { InAppBrowser, InAppBrowserObject }                 from '@ionic-native/in-app-browser';
import { Media, MediaObject, MEDIA_STATUS }                 from "@ionic-native/media";


declare let cordova: any;
declare let FB: any;

@Component({
    selector: 'page-radio',
    templateUrl: 'radio.html',
    providers: [MusicControls]
})
export class RadioPage {

    private streamingUrl:string;
    private hasLeft = false;
    private isPlaying = false;
    private isLoading = true;
    private playPauseButton = 'play';
    private isButtonActive = true;
    private playerReady = false;
    private currentSong = { cover: { jpg:'', svg:''  }, title:'', artist:'', track:'' };
    private lastSongs:{ cover: { jpg:'', svg:''  }, title:string, artist:string, track:string }[];
    private myOnlyTrack:any;
    private configReady = true;
    private shareOptions:any;
    private trackingOptions:any;
    private browserPopup:InAppBrowserObject;
    private mediaObject:MediaObject;

    constructor(public navCtrl: NavController,
                public viewCtrl: ViewController,
                public plt: Platform,
                private vars: GlobalService,
                private initService: InitService,
                private radioService: RadioService,
                private musicControls: MusicControls,
                private ga: GoogleAnalytics,
                private prompt: PromptService,
                private events: Events,
                private translateService: TranslateService,
                private tracker:TrackerService,
                private iab : InAppBrowser,
                private backgroundMode: BackgroundMode,
                private media: Media
    ) {
        this.currentSong = { cover: this.vars.COVER_DEFAULT, title:'Title', artist:'Artist', track:'Track' };

        this.plt.ready().then((readySource) => {
            console.log('Platform ready from', readySource);
            this.ga.trackView(this.viewCtrl.name);

            // Look for streaming address in a json file on a server
            this.initService.getInitData().then((data:any)=>{
                if(data.error) {
                    this.prompt.presentMessage({message: data.error.toString(), classNameCss: 'error'});
                    data = data.content;
                }
                this.streamingUrl = data.streamingUrl ? data.streamingUrl : this.vars.URL_STREAMING_DEFAULT;
                this.radioService.initLoop(data.loop_interval);
                this.configReady = false;
                this.initPlayer();
            });
        });
    }

    initPlayer() {
        this.playerReady = true;
        this.myOnlyTrack = {
            src: this.streamingUrl
        };
    }

    ionViewDidLoad() {
        this.events.subscribe('nowPlayingChanged', (currentSong, lastSongs)=>this.onNowPlayingChanged(currentSong, lastSongs));
        this.events.subscribe('onError', (error)=>this.onRadioServiceError(error));
    }

    ionViewDidEnter() {
        this.hasLeft = false;
    }

    onNowPlayingChanged(currentSong, lastSongs) {
        this.currentSong = currentSong;
        this.lastSongs = lastSongs;
        this.updateShareOptions();
        this.updateTrackingOptions();
        this.destroyMusicControls();
        this.createMusicControls();
    }

    onRadioServiceError(error) {
        this.prompt.presentMessage({message: error.toString(), classNameCss: 'error'})
    }

    togglePlayPause() {
        let trackingAction;
        if(this.isPlaying) {
            this.pause();
            trackingAction = { translate: 'TRACKING.PLAYER.ACTION.PAUSE'};
        }
        else {
            this.play();
            trackingAction = { translate: 'TRACKING.PLAYER.ACTION.PLAY'};
        }

        this.tracker.trackEventWithI18n(
            { translate: 'TRACKING.PLAYER.CATEGORY' },
            trackingAction,
            { translate: 'TRACKING.PLAYER.LABEL.PLAYER_BUTTONS', params: { date: Date.now().toString() } }
        );
    }

    play() {
        this.isButtonActive = false;
        this.prompt.presentLoading(true);
        this.isPlaying = true;
        this.startStreamingMedia();
        this.playPauseButton = 'pause';
    }
    startStreamingMedia() {
        this.mediaObject = this.media.create(this.myOnlyTrack.src);
        this.mediaObject.onStatusUpdate.subscribe( status => {
            if( status === MEDIA_STATUS.RUNNING ) {
                this.backgroundMode.enable();
                this.onTrackLoaded();

            }
            if((status === MEDIA_STATUS.STOPPED || status === MEDIA_STATUS.PAUSED) && this.backgroundMode.isEnabled()) {
                this.backgroundMode.disable();
            }
        });
        this.mediaObject.onError.subscribe(error => {
                console.log('Error!', error);
                this.onTrackError(error);
            }
        );

        // play the file
        this.mediaObject.play();
    }

    pause() {
        this.playPauseButton = 'play';
        this.isPlaying = false;
        this.isLoading = true;
        this.mediaObject.stop();
        if (typeof cordova !== 'undefined' && this.musicControls && typeof this.musicControls !== 'undefined') {
            this.musicControls.updateIsPlaying(false);
        }
    }

    createMusicControls() {
        if (typeof cordova !== 'undefined') {
            this.musicControls.create({
                track: this.currentSong.track,
                artist: this.currentSong.artist,
                cover: this.currentSong.cover.jpg,
                isPlaying: this.isPlaying,
                dismissable: true,
                hasPrev: false,      // show previous button, optional, default: true
                hasNext: false,      // show next button, optional, default: true
                hasClose: false,       // show close button, optional, default: false
                album: 'Faubourg Simone Radio',     // optional, default: ''
                duration: 0, // optional, default: 0
                elapsed: 0, // optional, default: 0
                ticker: `# Faubourg Simone # ${this.currentSong.title}`
            });

            this.musicControls.subscribe().subscribe(action => {
                switch (action) {
                    case 'music-controls-play':
                        this.play();
                        this.tracker.trackEventWithI18n(
                            { translate: 'TRACKING.PLAYER.CATEGORY' },
                            { translate: 'TRACKING.PLAYER.ACTION.PLAY' },
                            { translate: 'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS' }
                        );
                        break;
                    case 'music-controls-pause':
                        this.pause();
                        this.tracker.trackEventWithI18n(
                            { translate: 'TRACKING.PLAYER.CATEGORY' },
                            { translate: 'TRACKING.PLAYER.ACTION.PAUSE' },
                            { translate: 'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS' }
                        );

                        break;
                    case 'music-controls-destroy':
                        this.destroyMusicControls();
                        break;
                    // Headset events (Android only)
                    case 'music-controls-media-button' :
                        console.log('MEDIA BUTTON');
                        this.tracker.trackEventWithI18n(
                            { translate: 'TRACKING.PLAYER.CATEGORY' },
                            { translate: 'TRACKING.PLAYER.ACTION.MEDIA_BUTTON' },
                            { translate: 'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS' }
                        );

                        break;
                    case 'music-controls-headset-unplugged':
                        this.pause();
                        this.tracker.trackEventWithI18n(
                            { translate: 'TRACKING.PLAYER.CATEGORY' },
                            { translate: 'TRACKING.PLAYER.ACTION.HEADSET_UNPLUGGED' },
                            { translate: 'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS' }
                        );
                        break;
                    case 'music-controls-headset-plugged':
                        this.play();
                        this.tracker.trackEventWithI18n(
                            { translate: 'TRACKING.PLAYER.CATEGORY' },
                            { translate: 'TRACKING.PLAYER.ACTION.HEADSET_PLUGGED' },
                            { translate: 'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS' }
                        );
                        break;
                    default:
                        break;
                }

            });

            // activates the observable above
            this.musicControls.listen();
        }
    }

    postToFeed() {
        console.log('postToFeed');

        // Escape HTML
        const el:HTMLElement = document.createElement('textarea');
        el.innerHTML = this.currentSong.cover.jpg.toString();

        this.translateService
            .get('SHARING.CURRENT_SONG.FACEBOOK_FEED_DESCRIPTION', {track: this.currentSong.track, artist: this.currentSong.artist })
            .subscribe((result: string) => {
                let url = `https://www.facebook.com/dialog/feed?app_id=419281238161744&name=${this.currentSong.title}
                &display=popup&caption=http://faubourgsimone.paris/application-mobile
                &description=${result}
                &link=faubourgsimone.paris/application-mobile
                &picture=${el.innerHTML}`;
                this.browserPopup = this.iab.create(url, '_blank');
                // This check is because of a crash when simulated on desktop browser
                if(typeof this.browserPopup.on('loadstop').subscribe === 'function' ) {
                    this.browserPopup.on('loadstop').subscribe((evt)=>{
                        if(evt.url === 'https://www.facebook.com/dialog/return/close?#_=_') {
                            this.closePopUp();
                        }
                    });
                }
            });
    }

    closePopUp() {
        this.browserPopup.close();
    }

    updateShareOptions() {
        let shareOptions = {
            message: null,
            subject: null,
            url: null,
            image: this.currentSong.cover.jpg
        };

        this.translateService
            .get('SHARING.CURRENT_SONG.MESSAGE', {title: this.currentSong.title})
            .flatMap((result: string) => {
                shareOptions.message = result;
                return this.translateService.get('SHARING.CURRENT_SONG.SUBJECT')
            })
            .flatMap((result: string) => {
                shareOptions.subject = result;
                return this.translateService.get('SHARING.CURRENT_SONG.URL')
            })
            .subscribe((result: string) => {
                shareOptions.url = result;
                this.shareOptions = shareOptions;
            });
    }

    updateTrackingOptions() {
        let trackingOptions = {
            category:'',
            action:'',
            label:''
        };
        this.translateService
            .get('TRACKING.SHARE.CURRENT_SONG.CATEGORY')
            .flatMap((result: string) => {
                trackingOptions.category = result;
                return this.translateService.get('TRACKING.SHARE.CURRENT_SONG.ACTION')
            })
            .flatMap((result: string) => {
                trackingOptions.action = result;
                return this.translateService.get('TRACKING.SHARE.CURRENT_SONG.LABEL', {title: this.currentSong.title})
            })
            .subscribe((result: string) => {
                trackingOptions.label = result;
                this.trackingOptions = trackingOptions;
            });
    }

    destroyMusicControls() {
        if (typeof cordova !== 'undefined') {
            this.musicControls.destroy();

            this.tracker.trackEventWithI18n(
                { translate: 'TRACKING.PLAYER.CATEGORY' },
                { translate: 'TRACKING.PLAYER.ACTION.DESTROY' },
                { translate: 'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS' }
            );
        }
    }

    onTrackLoaded(event?) {
        this.isLoading = false;
        this.prompt.dismissLoading();
        this.isPlaying = true;
        this.isButtonActive = true;
        if (typeof cordova !== 'undefined') {
            this.musicControls.updateIsPlaying(true);
        }
    }

    onTrackError(event) {
        this.prompt.dismissLoading();
        this.pause();
        this.isButtonActive = true;
        if (typeof cordova !== 'undefined') {
            this.musicControls.updateIsPlaying(false);
        }
        this.prompt.presentMessage({message: event.toString(), classNameCss: 'error'});
    }

    ionViewDidLeave() {
        this.hasLeft = true;
        this.prompt.dismissLoading();
    }

}


