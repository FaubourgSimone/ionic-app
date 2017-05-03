import { Component } from '@angular/core';
import { NavController, Loading, LoadingController, ViewController, Platform, AlertController } from 'ionic-angular';
import { CalepinsService } from "../../providers/calepins-service";
import { CalepinPage } from "../calepin/calepin";
import { GlobalService } from "../../providers/global-service";

@Component({
  selector: 'page-calepins',
  templateUrl: 'calepins.html'
})
export class CalepinsPage {

  private calepins:any;
  private loader:Loading;

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public plt: Platform,
              private api:CalepinsService,
              private loadingCtrl: LoadingController,
              private vars: GlobalService,
              private alertCtrl:AlertController) {
  }

  ionViewDidLoad() {
    this.api.getCalepins().then((data)=>{
      this.calepins = data;
      this.dismissLoading();
    }).catch((error)=>{
      this.presentError(error.toString());
      this.dismissLoading();
    });
  }

  ionViewDidEnter() {
    if(typeof this.calepins === 'undefined') {
      this.presentLoading();
    }
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    this.api.getCalepins().then((data:any)=>{
      console.log(data);
      for (let i = 0, l=data.length; i < l; i++) {
        this.calepins.push( data[i] );
      }
      infiniteScroll.complete();
    }).catch((error)=>{
      this.presentError(error.toString());
    });
  }

  navToCalepin(id:number) {
    console.log('CalepinsPage.navToCalepin: ', id);
    this.navCtrl.push(CalepinPage, {
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
