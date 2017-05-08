import { Component } from '@angular/core';
import {
  NavController, NavParams, Loading, LoadingController, AlertController, ViewController,
  Platform
} from 'ionic-angular';
import { CasquesService } from "../../providers/casques-service";
import { DomSanitizer } from "@angular/platform-browser";
import { GlobalService } from "../../providers/global-service";
import {GoogleAnalytics} from "@ionic-native/google-analytics";

@Component({
  selector: 'page-casque',
  templateUrl: 'casque.html'
})
export class CasquePage {

  private postId:string;
  private casque:any;
  private loader:Loading;

  constructor(public navCtrl: NavController,
              private viewCtrl:ViewController,
              public navParams: NavParams,
              private api:CasquesService,
              private domSanitizer:DomSanitizer,
              private loadingCtrl: LoadingController,
              private vars: GlobalService,
              private alertCtrl:AlertController,
              private ga: GoogleAnalytics,
              private plt: Platform) {

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
      this.dismissLoading();
    }).catch((error)=>{
      this.presentError(error.toString());
      this.dismissLoading();
    });
  }

  ionViewDidEnter() {
    if(typeof this.casque === 'undefined') {
      this.presentLoading();
    }
  }

  onExternalLink() {
    this.ga.trackEvent('Cliquer sur le permalink', 'Naviguer dans les casques', this.casque.permalink);
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: this.vars.getRandomMessagePosts()
    });
    this.loader.present();
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

  ionViewWillLeave() {
    this.dismissLoading();
  }
}
