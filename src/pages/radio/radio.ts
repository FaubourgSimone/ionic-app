import { ViewController, Platform, NavController, Events } from 'ionic-angular';
import { Component }        from '@angular/core';
import { MusicControls }    from '@ionic-native/music-controls';
import { GoogleAnalytics }  from '@ionic-native/google-analytics';
import { AudioProvider }    from "ionic-audio";
import { InitService }      from '../../providers/init-service';
import { RadioService }     from '../../providers/radio-service';
import { GlobalService }    from '../../providers/global-service';
import { PromptService }    from "../../providers/prompt-service";
import { TranslateService } from "ng2-translate";
import {TrackerService} from "../../providers/tracker-service";

declare let cordova: any;

@Component({
    selector: 'page-radio',
    templateUrl: 'radio.html',
    providers: [MusicControls]
})
export class RadioPage {

    private streaming_url:string;
    private hasLeft:boolean = false;
    private isPlaying:boolean = false;
    private isLoading:boolean = true;
    private playPauseButton:string = 'play';
    private isButtonActive:boolean = true;
    // private volume:number = 50;
    private playerReady:boolean = false;
    private currentSong = { cover: { jpg:'', svg:''  }, title:'', artist:'', track:'' };
    private lastSongs:{ cover: { jpg:'', svg:''  }, title:string, artist:string, track:string }[];
    private myOnlyTrack:any;
    private configReady:boolean = true;
    private shareOptions:any;
    private trackingOptions:any;

    constructor(public navCtrl: NavController,
                public viewCtrl: ViewController,
                public plt: Platform,
                private vars: GlobalService,
                private initService: InitService,
                private radioService: RadioService,
                private musicControls: MusicControls,
                private _audioProvider: AudioProvider,
                private ga: GoogleAnalytics,
                private prompt: PromptService,
                private events: Events,
                private translateService: TranslateService,
                private tracker:TrackerService) {


        this.currentSong = { cover: this.vars.COVER_DEFAULT, title:'Title', artist:'Artist', track:'Track' };

        this.plt.ready().then((readySource) => {
            console.log('Platform ready from', readySource);
            this.ga.trackView(this.viewCtrl.name);

            // Cherche l'adresse du streaming dans un fichier json sur nos serveurs
            this.initService.getInitData().then((data:any)=>{
                if(data.error) {
                    this.prompt.presentMessage({message: data.error.toString(), classNameCss: 'error'});
                    data = data.content;
                }
                this.streaming_url = data.streaming_url ? data.streaming_url : this.vars.URL_STREAMING_DEFAULT;
                this.radioService.initLoop(data.loop_interval);
                this.configReady = false;
                this.initPlayer();
            });

        });
    }

    initPlayer() {
        this.playerReady = true;
        this.myOnlyTrack = {
            src: this.streaming_url
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
        this._audioProvider.play(0);
        this.playPauseButton = 'pause';
    }

    pause() {
        this.playPauseButton = 'play';
        this.isPlaying = false;
        this.isLoading = true;
        this._audioProvider.stop();
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
                ticker: '# Faubourg Simone # "' + this.currentSong.title + '"'
            });

            this.musicControls.subscribe().subscribe(action => {
                // const date = this.datePipe.transform(Date.now(), 'dd/MM/yyyy-HH:mm');
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

            this.musicControls.listen(); // activates the observable above
        }
    }

    updateShareOptions() {
        let shareOptions = {
            message: null,
            subject: null,
            url: null,
            image: this.currentSong.cover.jpg
        };

        // message, image, url, pasteMessageHint

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

    onTrackLoaded(event) {
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
