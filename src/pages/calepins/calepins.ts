import { Component } from '@angular/core';
import { NavController, ViewController, Platform, AlertController } from 'ionic-angular';
import { CalepinsService } from "../../providers/calepins-service";
import { CalepinPage } from "../calepin/calepin";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { PromptService } from "../../providers/prompt-service";

@Component({
    selector: 'page-calepins',
    templateUrl: 'calepins.html'
})
export class CalepinsPage {

    private calepins:any;
    private reloadNb:number = 0;

    constructor(public navCtrl: NavController,
                public viewCtrl: ViewController,
                public plt: Platform,
                private api: CalepinsService,
                private alertCtrl: AlertController,
                private ga: GoogleAnalytics,
                private prompt: PromptService) {

        this.plt.ready().then((readySource) => {
            console.log('Platform ready from', readySource);
            this.ga.trackView(this.viewCtrl.name);
        });

    }

    ionViewDidLoad() {
        this.api.getCalepins().then((data)=>{
            this.calepins = data;
            this.prompt.dismissLoading();
        }).catch((error)=>{
            this.presentError(error.toString());
            this.prompt.dismissLoading();
        });
    }

    ionViewDidEnter() {
        if(typeof this.calepins === 'undefined') {
            this.prompt.presentLoading();
        }
    }

    navToCalepin(id:number) {
        this.ga.trackEvent('Ouvrir un calepin', 'Naviguer dans les calepins', 'calepin-' + id.toString());
        this.navCtrl.push(CalepinPage, {
            postId: id
        });
    }

    doInfinite(infiniteScroll) {
        this.reloadNb++;
        this.ga.trackEvent('Charger les calepins suivants', 'Naviguer dans les calepins', 'refill-calepin-' + this.reloadNb.toString());

        this.api.getCalepins().then((data:any)=>{
            for (let i = 0, l=data.length; i < l; i++) {
                this.calepins.push( data[i] );
            }
            infiniteScroll.complete();
        }).catch((error)=>{
            this.presentError(error.toString());
        });
    }

    presentError(message) {
        let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: message,
            buttons: ['Moki Doki!']
        });
        alert.present();
    }

    ionViewWillLeave() {
        this.prompt.dismissLoading();
    }
}
