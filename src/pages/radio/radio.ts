import { ViewController, Platform, NavController, Events } from 'ionic-angular';
import { Component }        from '@angular/core';
import { MusicControls }    from '@ionic-native/music-controls';
import { GoogleAnalytics }  from '@ionic-native/google-analytics';
import { AudioProvider }    from "ionic-audio";
import { InitService }      from '../../providers/init-service';
import { RadioService }     from '../../providers/radio-service';
import { GlobalService }    from '../../providers/global-service';
import { PromptService }    from "../../providers/prompt-service";

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
    private playPauseButton:string = 'play';
    private isButtonActive:boolean = true;
    // private volume:number = 50;
    private playerReady:boolean = false;
    private currentSong = {
        cover_url: 'assets/images/cover-default.jpg',
        title: '',
        artist: '',
        track: ''
    };
    private lastSongs:{ cover_url:string, title:string, artist:string, track:string }[];
    private currentShareData:any;
    private myOnlyTrack:any;

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
                private events: Events) {

        this.plt.ready().then((readySource) => {
            console.log('Platform ready from', readySource);
            this.ga.trackView(this.viewCtrl.name);
        });

        // Cherche l'adresse du streaming dans un fichier json sur nos serveurs
        this.initService.getInitData().then((data:any)=>{
            this.streaming_url = data.streaming_url ? data.streaming_url : this.vars.URL_STREAMING_DEFAULT;
            // this.loop_interval = data.loop_interval ? data.loop_interval : this.loop_interval;
            this.initPlayer();

        }).catch((error)=>{
            this.streaming_url = this.vars.URL_STREAMING_DEFAULT;
            this.initPlayer();
            this.prompt.presentMessage({message: error.toString(), classNameCss: 'error'});
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
        this.radioService.initLoop();
    }

    ionViewDidEnter() {
        this.hasLeft = false;
    }

    onNowPlayingChanged(currentSong, lastSongs) {
        this.currentSong = currentSong;
        this.lastSongs = lastSongs;
        this.currentShareData = {
            message: this.currentSong.title + ' #NowPlaying sur Faubourg Simone (@FaubourgSimone) #music #radio #webradio',
            subject: 'En ce moment sur Faubourg Simone',
            url: 'http://faubourgsimone.paris'
        };

        this.destroyMusicControls();
        this.createMusicControls();

    }

    onRadioServiceError(error) {
        this.prompt.presentMessage({message: error.toString(), classNameCss: 'error'})
    }

    togglePlayPause() {
        if(this.isPlaying) {
            this.pause();
            this.ga.trackEvent('pause', 'Utiliser la radio', 'player-button',Date.now());
        }
        else {
            this.play();
            this.ga.trackEvent('play', 'Utiliser la radio', 'player-button', Date.now());
        }
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
                cover: this.currentSong.cover_url,
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
                        this.ga.trackEvent('play', 'Utiliser la radio', 'music-controls-play', Date.now());
                        break;
                    case 'music-controls-pause':
                        this.pause();
                        this.ga.trackEvent('pause', 'Utiliser la radio', 'music-controls-pause' + Date.now());
                        break;
                    case 'music-controls-destroy':
                        this.destroyMusicControls();
                        this.ga.trackEvent('close', 'Utiliser la radio', 'music-controls-destroy' + Date.now());
                        break;
                    // Headset events (Android only)
                    case 'music-controls-media-button' :
                        console.log('MEDIA BUTTON');
                        break;
                    case 'music-controls-headset-unplugged':
                        this.pause();
                        break;
                    case 'music-controls-headset-plugged':
                        this.play();
                        break;
                    default:
                        break;
                }

            });

            this.musicControls.listen(); // activates the observable above
        }
    }

    destroyMusicControls() {
        if (typeof cordova !== 'undefined') {
            this.musicControls.destroy();
        }
    }

    onTrackLoaded(event) {
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
