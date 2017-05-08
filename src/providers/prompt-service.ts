import { Injectable } from '@angular/core';
import { AlertController, Loading, LoadingController } from "ionic-angular";
import { GlobalService } from "./global-service";

@Injectable()
export class PromptService {

  private loader:Loading;

  constructor(private loadingCtrl: LoadingController,
              private vars: GlobalService,
              private alertCtrl: AlertController) {
    console.log('Hello PromptService Provider');
  }

  presentLoading(forRadio:boolean=false) {
    const message = forRadio ? this.vars.getRandomMessageRadio() : this.vars.getRandomMessagePosts();
    this.loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: message
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

}
