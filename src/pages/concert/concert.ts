import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-concert',
  templateUrl: 'concert.html'
})
export class ConcertPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl:AlertController) {}

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
