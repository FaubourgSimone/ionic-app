import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CalepinsService } from "../../providers/calepins-service";
import { DomSanitizer } from "@angular/platform-browser";


@Component({
  selector: 'page-calepin',
  templateUrl: 'calepin.html'
})
  export class CalepinPage {

  private postId:string;
  private calepin:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private api:CalepinsService,
              private domSanitizer:DomSanitizer) {
    this.postId = this.navParams.get('postId');
    this.api.getCalepin(this.postId).then((data:any)=>{
      data.content = this.domSanitizer.bypassSecurityTrustHtml(data.content);
      this.calepin = data;
    }).catch((error)=>this.errorHandling(error));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalepinPage: ', this.postId);
  }

  errorHandling(error:Error) {
    // TODO Afficher un message d'erreur
    console.log('CalepinPage.errorHandling: ', error.message);
  }

}
