import { Component, NgZone } from '@angular/core';
import { NavController, ViewController, Platform } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';
import { InitService } from '../../providers/init-service';
import { RadioService } from '../../providers/radio-service';
import { MusicControls } from '@ionic-native/music-controls';
import { GlobalService } from '../../providers/global-service';
import { AudioProvider } from "ionic-audio";
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { PromptService } from "../../providers/prompt-service";

declare let cordova: any;

@Component({
    selector: 'page-radio',
    templateUrl: 'radio.html',
    providers: [BackgroundMode, MusicControls]
})
export class RadioPage {

    private streaming_url:string;
    private loop_interval:Number = 3000;
    private timer:any;
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

    private myOnlyTrack:any;
    private lastSongs:{ cover_url:string, title:string, artist:string, track:string }[];
    private currentShareData:any;

    constructor(public viewCtrl: ViewController,
                public navCtrl: NavController,
                public plt: Platform,
                private vars: GlobalService,
                private initService: InitService,
                private radioService: RadioService,
                private backgroundMode: BackgroundMode,
                private zone: NgZone,
                private musicControls: MusicControls,
                private _audioProvider: AudioProvider,
                private ga: GoogleAnalytics,
                private prompt: PromptService) {

        this.plt.ready().then((readySource) => {
            console.log('Platform ready from', readySource);

            this.ga.trackView(this.viewCtrl.name);

            // Platform now ready, execute any required native code
            this.plt.registerBackButtonAction(()=> {
                let nav = this.viewCtrl.getNav();
                // let activeView: ViewController = nav.getActiveChildNav();
                if(this.viewCtrl != null){
                    if(nav.canGoBack()) {
                        nav.pop();
                    }else if (typeof this.viewCtrl.instance.backButtonAction === 'function')
                        this.viewCtrl.instance.backButtonAction();
                    else nav.parent.select(0); // goes to the first tab
                }
            })
        });

        // Cherche l'adresse du streaming dans un fichier json sur nos serveurs
        this.initService.getInitData().then((data:any)=>{
            this.streaming_url = data.streaming_url ? data.streaming_url : this.vars.URL_STREAMING_DEFAULT;
            this.loop_interval = data.loop_interval ? data.loop_interval : this.loop_interval;
            this.initPlayer();

        }).catch((error)=>{
            this.streaming_url = this.vars.URL_STREAMING_DEFAULT;
            this.initPlayer();
            this.prompt.presentError(error.toString());
        });
    }

    initPlayer() {
        this.playerReady = true;
        this.myOnlyTrack = {
            src: this.streaming_url
        };
    }

    ionViewDidLoad() {
        this.manageBackground();
    }

    ionViewDidEnter() {
        this.hasLeft = false;
        this.loopData();
    }

    manageBackground(){
        this.backgroundMode.enable();
        try {
            // enter background mode
            this.backgroundMode.on('activate').subscribe(()=> {});
            // leave background mode
            this.backgroundMode.on('deactivate').subscribe(()=> {
                this.zone.run(()=>{
                    this.loopData();
                });
            });
        }
        catch(e) {}
    }

    loopData() {
        if(this.timer) {
            clearTimeout(this.timer);
        }
        // Looking for information about current song
        this.radioService.getCurrentSongs().subscribe(
            data => {
                // TODO: mettre ca dans le RadioService ?
                let hasChanged = (this.currentSong.title !== data.songs[0].title);

                if(hasChanged) {

                    this.currentSong = {
                        cover_url: data.songs[0].album_cover || '',
                        title: data.songs[0].title || '',
                        artist: data.songs[0].title.split(" - ")[0],
                        track: data.songs[0].title.split(" - ")[1]
                    };
                    this.lastSongs = data.songs.map((song)=> {
                        let result = {
                            cover_url: song.album_cover || '',
                            title: song.title || '',
                            artist: song.title.split(" - ")[0],
                            track: song.title.split(" - ")[1]
                        };
                        return result;
                    });

                    this.currentShareData = {
                        message: this.currentSong.title + ' #NowPlaying sur Faubourg Simone (@FaubourgSimone) #music #radio #webradio',
                        subject: 'En ce moment sur Faubourg Simone',
                        url: 'http://faubourgsimone.paris'
                    };

                    this.lastSongs.shift();
                    this.destroyMusicControls();
                    this.createMusicControls();
                }
                this.timer = setTimeout(()=>this.loopData(), this.loop_interval);
            },
            error => this.prompt.presentError(error.toString())
        );
    }

    togglePlayPause() {
        if(this.isPlaying) {
            this.ga.trackEvent('pause', 'Utiliser la radio', 'player-button',Date.now());
            this.pause();
        }
        else {
            this.ga.trackEvent('play', 'Utiliser la radio', 'player-button', Date.now());
            this.play();
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
        if (typeof cordova !== 'undefined') {
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
                hasClose: true,       // show close button, optional, default: false
                album: 'Faubourg Simone Radio',     // optional, default: ''
                duration: 0, // optional, default: 0
                elapsed: 0, // optional, default: 0
                ticker: '# Faubourg Simone # "' + this.currentSong.title + '"'
            });

            this.musicControls.subscribe().subscribe(action => {
                // const date = this.datePipe.transform(Date.now(), 'dd/MM/yyyy-HH:mm');
                switch (action) {
                    case 'music-controls-play':
                        this.ga.trackEvent('play', 'Utiliser la radio', 'music-controls-play', Date.now());
                        this.play();
                        break;
                    case 'music-controls-pause':
                        this.ga.trackEvent('pause', 'Utiliser la radio', 'music-controls-pause' + Date.now());
                        this.pause();
                        break;
                    case 'music-controls-destroy':
                        this.ga.trackEvent('close', 'Utiliser la radio', 'music-controls-destroy' + Date.now());
                        this.destroyMusicControls();
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
        this.prompt.presentError(event.toString());
    }

    ionViewDidLeave() {
        this.hasLeft = true;
        this.prompt.dismissLoading();
    }

}
