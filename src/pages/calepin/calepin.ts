import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { CalepinsService } from "../../providers/calepins-service";
import { DomSanitizer } from "@angular/platform-browser";
import { GlobalService } from "../../providers/global-service";


@Component({
    selector: 'page-calepin',
    templateUrl: 'calepin.html'
})
export class CalepinPage {

    private postId:string;
    private calepin:any;
    private loader:Loading;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private api: CalepinsService,
                private domSanitizer: DomSanitizer,
                private loadingCtrl: LoadingController,
                private vars: GlobalService,
                private alertCtrl:AlertController) {
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
