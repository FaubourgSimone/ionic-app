import { Injectable } from '@angular/core';
import {Loading, LoadingController} from "ionic-angular";
import {GlobalService} from "./global-service";

@Injectable()
export class PromptService {

  private loader:Loading;

  constructor(private loadingCtrl: LoadingController, private vars: GlobalService) {
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

}
