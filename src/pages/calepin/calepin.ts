import { Component } from '@angular/core';
import {NavController, NavParams, Loading, LoadingController, AlertController, ViewController} from 'ionic-angular';
import { CalepinsService } from "../../providers/calepins-service";
import { DomSanitizer } from "@angular/platform-browser";
import { GlobalService } from "../../providers/global-service";
import { GoogleAnalytics } from "@ionic-native/google-analytics";


@Component({
    selector: 'page-calepin',
    templateUrl: 'calepin.html'
})
export class CalepinPage {

    private postId:string;
    private calepin:any;
    private loader:Loading;

    constructor(public navCtrl: NavController,
                private viewCtrl:ViewController,
                public navParams: NavParams,
                private api: CalepinsService,
                private domSanitizer: DomSanitizer,
                private loadingCtrl: LoadingController,
                private vars: GlobalService,
                private alertCtrl:AlertController,
                private ga: GoogleAnalytics) {

        this.ga.trackView(this.viewCtrl.name);
        this.postId = this.navParams.get('postId');

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CalepinPage: ', this.postId);
        this.api.getCalepin(this.postId).then((data:any)=>{
            data.content = this.domSanitizer.bypassSecurityTrustHtml(data.content);
            this.calepin = data;
            this.dismissLoading();
        }).catch((error)=>{
            this.presentError(error.toString());
            this.dismissLoading();
        });
    }

    ionViewDidEnter() {
        if(typeof this.calepin === 'undefined') {
            this.presentLoading();
        }
    }

    presentLoading() {
        this.loader = this.loadingCtrl.create({
            spinner: 'dots',
            content: this.vars.getRandomMessagePosts()
        });
        this.loader.present();
    }

    ionViewWillLeave() {
        this.dismissLoading();
    }

    // onShareClick() {
    //     console.log('CalepinPage.onShareClick');
    //     const options = {
    //         message: '"' + this.calepin.title + ' - ' + this.calepin.subtitle + '" sur Faubourg Simone (@FaubourgSimone)',
    //         subject: this.calepin.title + 'sur Faubourg Simone', // fi. for email
    //         files: [], // an array of filenames either locally or remotely
    //         url: this.calepin.permalink,
    //         chooserTitle: 'Choisis une application' // Android only, you can override the default share sheet title
    //     };
    //     this.socialSharing.shareWithOptions( options ).then(() => {
    //         this.ga.trackEvent('Partager un calepin', 'Partager', this.calepin.permalink, 1);
    //     }).catch(() => {
    //         this.ga.trackEvent('Partager un calepin', 'Erreur', this.calepin.permalink, 1);
    //     });
    // }

    onExternalLink() {
        this.ga.trackEvent('Cliquer sur le permalink', 'Naviguer dans les calepins', this.calepin.permalink);
    }

    dismissLoading() {
        if(this.loader) {
            this.loader.dismiss();
        }
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
