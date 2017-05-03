import { Component } from '@angular/core';
import { NavController, Loading, LoadingController, AlertController } from 'ionic-angular';
import { CasquesService } from "../../providers/casques-service";
import { CasquePage } from "../casque/casque";
import { GlobalService } from "../../providers/global-service";

@Component({
  selector: 'page-casques',
  templateUrl: 'casques.html'
})
export class CasquesPage {

  private casques:any;
  private loader:Loading;

  constructor(public navCtrl: NavController,
              private api:CasquesService,
              private loadingCtrl: LoadingController,
              private vars: GlobalService,
              private alertCtrl:AlertController) {
  }

  ionViewDidLoad() {
    this.api.getCasques().then((data)=>{
      this.casques = data;
      console.log(this.casques);
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

  doInfinite(infiniteScroll) {
    this.api.getCasques().then((data:any)=>{
      console.log(data);
      for (let i = 0, l=data.length; i < l; i++) {
        this.casques.push( data[i] );
      }
      infiniteScroll.complete();
    }).catch((error)=>{
      this.presentError(error.toString());
    });
  }

  navToCasque(id:number) {
    console.log('CasquesPage.navToCasque: ', id);
    this.navCtrl.push(CasquePage, {
      postId: id
    });
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
