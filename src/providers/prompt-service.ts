import { Injectable } from '@angular/core';
import { Loading, LoadingController, ToastController } from "ionic-angular";
import { GlobalService } from "./global-service";

@Injectable()
export class PromptService {

  private loader:Loading;

  constructor(private loadingCtrl: LoadingController,
              private vars: GlobalService,
              private toastCtrl: ToastController) {
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

  presentError(message, callback=null) {

    let toast = this.toastCtrl.create({
      message: message,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'x'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      if(callback !== null) {
        callback();
      }
    });

    toast.present();
  }

}
