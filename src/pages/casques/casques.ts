import { Component } from '@angular/core';
import { NavController, Loading, LoadingController } from 'ionic-angular';
import { CasquesService } from "../../providers/casques-service";
import {CustomErrorHandler} from "../../components/custom-error-handler";
import {CasquePage} from "../casque/casque";
import {GlobalService} from "../../providers/global-service";

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
              private errorHandler:CustomErrorHandler,
              private vars: GlobalService) {
  }

  ionViewDidLoad() {
    this.api.getCasques().then((data)=>{
      this.casques = data;
      console.log(this.casques);
      this.dismissLoading();
    }).catch((error)=>{
      this.errorHandler.handleError(error);
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
      this.errorHandler.handleError(error);
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
}
