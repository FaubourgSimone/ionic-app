import { Component, NgZone } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';
import { RadioPlayer } from '../../providers/radioplayer';
import { InformationService } from '../../services/information';
import { MusicControls } from '@ionic-native/music-controls';

declare let cordova: any;

@Component({
    selector: 'page-radio',
    templateUrl: 'radio.html',
    providers: [InformationService, BackgroundMode, MusicControls]
})
export class RadioPage {

    private streaming_url:string = 'http://91.121.65.131:1337/faubourgsimone';
    private loop_interval:Number = 3000;
    private timer:any;
    private hasLeft:boolean = false;
    private isPlaying:boolean = false;
    private playPauseButton:string = 'play';
    private isButtonActive:boolean = true;
    // private volume:number = 50;

    private currentSong = {
        cover_url: 'assets/images/cover-default.jpg',
        title: '',
        artist: '',
        track: ''
    };

    constructor(public viewCtrl: ViewController,
                public navCtrl: NavController,
                private player: RadioPlayer,
                private informationService: InformationService,
                private backgroundMode: BackgroundMode,
                private zone: NgZone,
                private musicControls: MusicControls) {

        // Cherche l'adresse du streaming dans un fichier json sur nos serveurs
        this.informationService.getInitData().subscribe(
            // Success
            data => {
                console.log('Data received ', data.loop_interval);
                this.streaming_url = data.streaming_url ? data.streaming_url : this.streaming_url;
                this.loop_interval = data.loop_interval ? data.loop_interval : this.loop_interval;
                // this.goOn();
            }
            // Failure
            // err => this.goOn()
        );
    }

    ngOnInit() {
        console.log('NG INIT');

        this.manageBackground();

        this.player.init(this.streaming_url);

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

    ionViewDidLoad() {
        console.log('ION VIEW DID LOAD');
    }

    ionViewDidEnter() {
        console.log('ionViewDidEnter');
        this.hasLeft = false;
        this.loopData();
    }
    ionViewDidLeave() {
        this.hasLeft = true;
        // if(this.timer && !this.isPlaying) {
        //     clearTimeout(this.timer);
        // }
    }

    // setVolume() {
    //     console.log('RadioPage.setVolume ', this.volume/100);
    //     // if (typeof cordova !== 'undefined') {
    //     //     // console.log(cordova.plugins.VolumeControl);
    //     //     console.log("volume : ", cordova.plugins.VolumeControl.getVolume());
    //     //     cordova.plugins.VolumeControl.setVolume(this.volume/100);
    //     // }
    //     // else{
    //     //     console.log("NOT FOUND");
    //     // }
    // }

    loopData() {
        if(this.timer) {
            // console.log('clear timer');
            clearTimeout(this.timer);
        }
        // console.log('loopdata ', this);
        // Cherche les informations sur la piste en cours de lecture
        this.informationService.getCurrentSongs().subscribe(
            data => {
                console.log('############################################################');
                let hasChanged = (this.currentSong.title !== data.songs[0].title);

                this.currentSong = {
                    cover_url: data.songs[0].album_cover || '',
                    title: data.songs[0].title || '',
                    artist: data.songs[0].title.split(" - ")[0],
                    track: data.songs[0].title.split(" - ")[1]
                };
                if(hasChanged) {
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
        console.log('Waiting For Streaming');
        if(this.player.isPlaying) {
            return false;
        }
        this.playPauseButton = 'pause';
        this.player.play()
            .catch(error => this.handlePlayError(error))
            .then(() => {
                console.log('Start Playing');
                this.isPlaying = true;
                this.isButtonActive = true;
                if (typeof cordova !== 'undefined') {
                    this.musicControls.updateIsPlaying(true);
                }
            });
    }

    pause() {
        console.log('RadioPage.pause');
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
        // console.log('CREATE MUSIC CONTROLS');
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
