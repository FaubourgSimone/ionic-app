import { Component } from '@angular/core';
import { NavController, Loading, LoadingController, AlertController, ViewController, Platform } from 'ionic-angular';
import { CasquesService } from "../../providers/casques-service";
import { CasquePage } from "../casque/casque";
import { GlobalService } from "../../providers/global-service";
import { GoogleAnalytics } from "@ionic-native/google-analytics";

@Component({
  selector: 'page-casques',
  templateUrl: 'casques.html'
})
export class CasquesPage {

  private casques:any;
  private loader:Loading;
  private reloadNb:number = 0;

  constructor(public navCtrl: NavController,
              private viewCtrl:ViewController,
              private api:CasquesService,
              private loadingCtrl: LoadingController,
              private vars: GlobalService,
              private alertCtrl:AlertController,
              private ga: GoogleAnalytics,
              private plt:Platform) {

    this.plt.ready().then((readySource) => {
      console.log('Platform ready from', readySource);
      this.ga.trackView(this.viewCtrl.name);
    });

  }

  ionViewDidLoad() {
    this.api.getCasques().then((data)=>{
      this.casques = data;
      this.dismissLoading();
    }).catch((error)=>{
      this.presentError(error.toString());
      this.dismissLoading();
    });
  }

  ionViewDidEnter() {
    if(typeof this.casques === 'undefined') {
      this.presentLoading();
    }
  }

  navToCasque(id:number) {
    this.ga.trackEvent('Ouvrir un casque', 'Naviguer dans les casques', 'casque-' + id.toString());
    this.navCtrl.push(CasquePage, {
      postId: id
    });
  }

  doInfinite(infiniteScroll) {
    this.reloadNb++;
    this.ga.trackEvent('Charger les casques suivants', 'Naviguer dans les casques', 'refill-casque-' + this.reloadNb.toString());
    this.api.getCasques().then((data:any)=>{
      for (let i = 0, l=data.length; i < l; i++) {
        this.casques.push( data[i] );
      }
      infiniteScroll.complete();
    }).catch((error)=>{
      this.presentError(error.toString());
    });
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
