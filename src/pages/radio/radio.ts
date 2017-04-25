import { Component, NgZone } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';
import { RadioPlayer } from '../../providers/radioplayer';
import { InitService } from '../../providers/init-service';
import { MusicControls } from '@ionic-native/music-controls';
import { LoadingController, Loading } from 'ionic-angular';
import { GlobalVars } from '../../providers/global-variables';

declare let cordova: any;

@Component({
    selector: 'page-radio',
    templateUrl: 'radio.html',
    providers: [InitService, BackgroundMode, MusicControls, GlobalVars]
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
    private loader:Loading;
    private playerReady:boolean = false;

    private currentSong = {
        cover_url: 'assets/images/cover-default.jpg',
        title: '',
        artist: '',
        track: ''
    };

    private lastSongs:{ cover_url:string, title:string, artist:string, track:string }[];


    constructor(public viewCtrl: ViewController,
                public navCtrl: NavController,
                private vars: GlobalVars,
                private player: RadioPlayer,
                private initService: InitService,
                private backgroundMode: BackgroundMode,
                private zone: NgZone,
                private musicControls: MusicControls,
                public loadingCtrl: LoadingController) {

        // Cherche l'adresse du streaming dans un fichier json sur nos serveurs
        this.initService.getInitData().subscribe(
            // Success
            data => {
                this.streaming_url = data.streaming_url ? data.streaming_url : this.vars.URL_STREAMING_DEFAULT;
                this.loop_interval = data.loop_interval ? data.loop_interval : this.loop_interval;
                this.player.init(this.streaming_url);
                this.playerReady = true;
            },
            err => console.log(err)
        );
    }

    ngOnInit() {
        this.manageBackground();
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

    ionViewDidEnter() {
        this.hasLeft = false;
        this.loopData();
    }
    ionViewDidLeave() {
        this.hasLeft = true;
    }

    presentLoading() {
        this.loader = this.loadingCtrl.create({
            spinner: 'dots',
            content: 'Paris ne s\'est pas faite en un jour...'
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
        this.initService.getCurrentSongs().subscribe(
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
            err => this.handleCurrentError(err)
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
        if(this.player.isPlaying) {
            return false;
        }
        this.playPauseButton = 'pause';
        this.player.play()
            .catch(error => this.handlePlayError(error))
            .then(() => {
                this.isPlaying = true;
                this.isButtonActive = true;
                this.dismissLoading();
                if (typeof cordova !== 'undefined') {
                    this.musicControls.updateIsPlaying(true);
                }
            });
    }

    pause() {
        this.playPauseButton = 'play';
        this.isPlaying = false;
        this.player.pause();
        if (typeof cordova !== 'undefined') {
            this.musicControls.updateIsPlaying(false);
        }
    }


    destroyMusicControls() {
        if (typeof cordova !== 'undefined') {
            this.musicControls.destroy();
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

    handlePlayError(error) {
        console.log('Radio.handlePlayError: ', error);
        // TODO: display message
    }

    handleCurrentError(error) {
        console.log('Radio.handleCurrentError: ', error);
        // TODO: display message
    }
}
