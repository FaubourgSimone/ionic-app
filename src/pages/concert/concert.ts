import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController, Platform } from 'ionic-angular';
import { GoogleAnalytics } from "@ionic-native/google-analytics";

@Component({
  selector: 'page-concert',
  templateUrl: 'concert.html'
})
export class ConcertPage {

  constructor(public navCtrl: NavController,
              private viewCtrl:ViewController,
              public navParams: NavParams,
              private alertCtrl:AlertController,
              private ga: GoogleAnalytics,
              private plt: Platform) {

    this.plt.ready().then((readySource) => {
      console.log('Platform ready from', readySource);
      this.ga.trackView(this.viewCtrl.name);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConcertPage');
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
