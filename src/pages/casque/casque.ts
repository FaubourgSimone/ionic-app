import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { CasquesService } from "../../providers/casques-service";
import { DomSanitizer } from "@angular/platform-browser";
import { CustomErrorHandler } from "../../components/custom-error-handler";

/*
  Generated class for the Casque page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-casque',
  templateUrl: 'casque.html'
})
export class CasquePage {

  private postId:string;
  private casque:any;
  private loader:Loading;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private api:CasquesService,
              private domSanitizer:DomSanitizer,
              private errorHandler:CustomErrorHandler,
              private loadingCtrl: LoadingController) {
    this.postId = this.navParams.get('postId');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CasquePage: ', this.postId);
    this.api.getCasque(this.postId).then((data:any)=>{
      data.content = this.domSanitizer.bypassSecurityTrustHtml(data.content);
      this.casque = data;
      this.dismissLoading();
    }).catch((error)=>this.errorHandler.handleError(error));
  }

  ionViewDidEnter() {
    if(typeof this.casque === 'undefined') {
      this.presentLoading();
    }
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Quelques secondes minouche !'
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
}
