import { Component } from '@angular/core';
import {
    NavController, NavParams, AlertController, ViewController,
    Platform
} from 'ionic-angular';
import { CasquesService } from "../../providers/casques-service";
import { DomSanitizer } from "@angular/platform-browser";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { PromptService } from "../../providers/prompt-service";

@Component({
    selector: 'page-casque',
    templateUrl: 'casque.html'
})
export class CasquePage {

    private postId:string;
    private casque:any;

    constructor(public navCtrl: NavController,
                private viewCtrl: ViewController,
                public navParams: NavParams,
                private api: CasquesService,
                private domSanitizer: DomSanitizer,
                private alertCtrl: AlertController,
                private ga: GoogleAnalytics,
                private plt: Platform,
                private prompt: PromptService) {

        this.plt.ready().then((readySource) => {
            console.log('Platform ready from', readySource);
            this.ga.trackView(this.viewCtrl.name);
        });

        this.postId = this.navParams.get('postId');
    }

    ionViewDidLoad() {
        this.api.getCasque(this.postId).then((data:any)=>{
            data.content = this.domSanitizer.bypassSecurityTrustHtml(data.content);
            this.casque = data;
            this.prompt.dismissLoading();
        }).catch((error)=>{
            this.presentError(error.toString());
            this.prompt.dismissLoading();
        });
    }

    ionViewDidEnter() {
        if(typeof this.casque === 'undefined') {
            this.prompt.presentLoading();
        }
    }

    onExternalLink() {
        this.ga.trackEvent('Cliquer sur le permalink', 'Naviguer dans les casques', this.casque.permalink);
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
