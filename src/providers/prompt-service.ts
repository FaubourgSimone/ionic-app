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

  presentMessage({message, classNameCss, duration, callback}:{message:string, classNameCss?:string, duration?:number, callback?:Function}) {

    let toast = this.toastCtrl.create({
      position: 'bottom',
      dismissOnPageChange: true,
      showCloseButton: true,
      closeButtonText: 'x',
      message: message,
      duration: duration || 5000,
      cssClass: classNameCss || ''
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      if(callback) {
        callback();
      }
    });

    toast.present();
  }
}
