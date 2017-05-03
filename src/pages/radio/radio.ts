import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, ViewController, LoadingController, Loading, Platform, AlertController } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';
import { RadioPlayer } from '../../providers/radioplayer';
import { InitService } from '../../providers/init-service';
import { RadioService } from '../../providers/radio-service';
import { MusicControls } from '@ionic-native/music-controls';
import { GlobalService } from '../../providers/global-service';
import { AudioProvider } from "ionic-audio";

declare let cordova: any;

@Component({
    selector: 'page-radio',
    templateUrl: 'radio.html',
    providers: [BackgroundMode, MusicControls]
})
export class RadioPage {

    // @ViewChild('audio')
    // set myAudio(ref: any) {
    //     // console.log('#########################################');
    //     // console.log(ref);
    //     this.myAudioTrackComponent = ref;
    // }

    private streaming_url:string;
    private loop_interval:Number = 3000;
    private timer:any;
    private hasLeft:boolean = false;
    private isPlaying:boolean = false;
    private playPauseButton:string = 'play';
    private isButtonActive:boolean = true;
    // private volume:number = 50;
    private loader:Loading;
    private playerReady:boolean = false;

    private currentSong = {
        cover_url: 'assets/images/cover-default.jpg',
        title: '',
        artist: '',
        track: ''
    };

    private myOnlyTrack:any;
    private lastSongs:{ cover_url:string, title:string, artist:string, track:string }[];

    constructor(public viewCtrl: ViewController,
                public navCtrl: NavController,
                public plt: Platform,
                private vars: GlobalService,
                private player: RadioPlayer,
                private initService: InitService,
                private radioService: RadioService,
                private backgroundMode: BackgroundMode,
                private zone: NgZone,
                private musicControls: MusicControls,
                private loadingCtrl: LoadingController,
                private _audioProvider: AudioProvider,
                private alertCtrl:AlertController) {
        super();
        this.plt.ready().then((readySource) => {
            console.log('Platform ready from', readySource);
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
            this.presentError(error.toString());
        });
    }

    coucou() {
        super.coucou();
    }

    initPlayer() {
        this.player.init(this.streaming_url);
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
            // ENTREE DU MODE BACKGROUND
            this.backgroundMode.on('activate').subscribe(()=> {
                // if(this.timer && !this.isPlaying) {
                //     clearTimeout(this.timer);
                // }
            });
            // SORTIE DU MODE BACKGROUND
            this.backgroundMode.on('deactivate').subscribe(()=> {
                this.zone.run(()=>{
                    // si on n'avait pas change de tab avant de rentrer en mode background
                    // if(!this.hasLeft) {
                    this.loopData();
                    // }
                });
            });
        }
        catch(e) {}
    }

    presentLoading() {
        this.loader = this.loadingCtrl.create({
            spinner: 'dots',
            content: this.vars.getRandomMessageRadio(),
            dismissOnPageChange: true
        });
        this.loader.present();
    }

    dismissLoading() {
        if(this.loader) {
            this.loader.dismiss();
        }
    }

    loopData() {
        if(this.timer) {
            clearTimeout(this.timer);
        }
        // Cherche les informations sur la piste en cours de lecture
        this.radioService.getCurrentSongs().subscribe(
            data => {
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
                    this.lastSongs.shift();
                    this.destroyMusicControls();
                    this.createMusicControls();
                }
                this.timer = setTimeout(()=>this.loopData(), this.loop_interval);
            },
            error => this.presentError(error.toString())
        );
    }

    togglePlayPause() {
        if(this.isPlaying) {
            this.pause();
        }
        else {
            this.play();
        }
    }

    play() {
        this.isButtonActive = false;
        this.presentLoading();
        if(this._audioProvider.tracks[0] &&
            this._audioProvider.tracks[0].isPlaying) {
            return false;
        }

        if(typeof this._audioProvider.current !== 'undefined') {
            return false;
        }
        this.isPlaying = true;
        this._audioProvider.play(0);
        this.playPauseButton = 'pause';
    }

    onTrackLoaded(event) {
        this.dismissLoading();
        this.isPlaying = true;
        this.isButtonActive = true;
        if (typeof cordova !== 'undefined') {
            this.musicControls.updateIsPlaying(true);
        }
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

                switch (action) {
                    case 'music-controls-play':
                        this.play();
                        break;
                    case 'music-controls-pause':
                        this.pause();
                        break;
                    case 'music-controls-destroy':
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

    ionViewDidLeave() {
        this.hasLeft = true;
    }

    presentError(message) {
        let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: message,
            buttons: ['Moki Doki!']
        });
        alert.present();
    }

}
