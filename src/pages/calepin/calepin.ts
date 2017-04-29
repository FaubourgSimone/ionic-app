import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {CalepinsService} from "../../providers/calepins-service";

/*
  Generated class for the Calepin page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-calepin',
  templateUrl: 'calepin.html'
})
  export class CalepinPage {

  private postId:string;
  private calepin:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api:CalepinsService) {
    this.postId = this.navParams.get('postId');
    this.api.getCalepin(this.postId).then((data)=>{
      console.log(data);
      this.calepin = data;
      // console.log(this.calepin);
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
