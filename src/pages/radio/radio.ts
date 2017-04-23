import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RadioPlayer } from '../../providers/radioplayer';
import { InformationService } from '../../services/information';
import { BackgroundMode } from '@ionic-native/background-mode';

@Component({
    selector: 'page-radio',
    templateUrl: 'radio.html',
    providers: [InformationService, BackgroundMode]
})
export class RadioPage {

    private streaming_url:string = 'http://91.121.65.131:1337/faubourgsimone';
    private loop_interval:Number = 3000;
    private timer:any;

    private currentSong:Object = {
        cover_url: 'assets/images/cover-default.jpg',
        title: ''
    };

    constructor(public navCtrl: NavController,
                private player:RadioPlayer,
                private informationService:InformationService,
                private backgroundMode: BackgroundMode) {

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
        this.backgroundMode.enable();

        try {
            this.backgroundMode.on('activate').subscribe(()=> {
                if(this.timer) {
                    clearTimeout(this.timer);
                }
            });
            this.backgroundMode.on('deactivate').subscribe(()=> {
                this.loopData();
            });
        }
        catch(e) {}



        this.player.init(this.streaming_url);
    }

    ionViewWillEnter() {
        this.loopData();
    }
    ionViewWillLeave() {
        if(this.timer) {
            clearTimeout(this.timer);
        }
    }

    loopData() {
        if(this.timer) {
            // console.log('clear timer');
            clearTimeout(this.timer);
        }
        // console.log('loopdata ', this);
        // Cherche les informations sur la piste en cours de lecture
        this.informationService.getCurrentSongs().subscribe(
            data => {
                this.currentSong = {
                    cover_url: data.songs[0].album_cover || '',
                    title: data.songs[0].title || ''
                };
                this.timer = setTimeout(()=>this.loopData(), this.loop_interval);
            },
            err => this.handleCurrentError(err)
        );
    }



    play() {
        console.log('Waiting For Streaming');
        this.player.play()
            .catch(error => this.handlePlayError(error))
            .then(() => {
                console.log('Start Playing');
            });
    }

    handlePlayError(error) {
        console.log('Radio.handlePlayError: ', error);
        // TODO: display message
    }

    handleCurrentError(error) {
        console.log('Radio.handleCurrentError: ', error);
        // TODO: display message
    }




    pause() {
        this.player.pause();
    }

}
