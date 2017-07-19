import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { AppVersion } from "@ionic-native/app-version";

@Component({
    selector: 'page-credits',
    templateUrl: 'credits.html'
})
export class CreditsPage {

    private appName:string;
    private appPackageName:string;
    private appVersionCode:string;
    private appVersionNumber:string;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private appVersion: AppVersion,
                public viewCtrl:ViewController,
                private platform: Platform) {

        platform.ready().then(() => {
            this.appVersion.getAppName().then((value)=>this.appName=value).catch((e)=>console.log(e));
            this.appVersion.getPackageName().then((value)=>this.appPackageName=value).catch((e)=>console.log(e));
            this.appVersion.getVersionCode().then((value)=>this.appVersionCode=value).catch((e)=>console.log(e));
            this.appVersion.getVersionNumber().then((value)=>this.appVersionNumber=value).catch((e)=>console.log(e));
        });
    }


    ionViewDidLoad() {
        // TODO : tracking
        console.log('ionViewDidLoad CreditsPagePage');
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
