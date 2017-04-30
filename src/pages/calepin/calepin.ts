import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { CalepinsService } from "../../providers/calepins-service";
import { DomSanitizer } from "@angular/platform-browser";
import { CustomErrorHandler } from "../../components/custom-error-handler";


@Component({
  selector: 'page-calepin',
  templateUrl: 'calepin.html'
})
  export class CalepinPage {

  private postId:string;
  private calepin:any;
  private loader:Loading;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private api:CalepinsService,
              private domSanitizer:DomSanitizer,
              private errorHandler:CustomErrorHandler,
              private loadingCtrl: LoadingController) {
    this.postId = this.navParams.get('postId');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalepinPage: ', this.postId);
    this.presentLoading();
    this.api.getCalepin(this.postId).then((data:any)=>{
      data.content = this.domSanitizer.bypassSecurityTrustHtml(data.content);
      this.calepin = data;
      this.dismissLoading();
    }).catch((error)=>this.errorHandler.handleError(error));
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Patience beauté !'
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
