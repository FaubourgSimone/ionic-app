import { Component } from '@angular/core';
import { NavController, Loading, LoadingController, AlertController } from 'ionic-angular';
import { CasquesService } from "../../providers/casques-service";
import { CasquePage } from "../casque/casque";
import { GlobalService } from "../../providers/global-service";
import { SocialSharing } from "@ionic-native/social-sharing";

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
              private vars: GlobalService,
              private alertCtrl:AlertController,
              private socialSharing: SocialSharing) {
  }

  ionViewDidLoad() {
    this.api.getCasques().then((data)=>{
      this.casques = data;
      console.log(this.casques);
      this.dismissLoading();
    }).catch((error)=>{
      this.presentError(error.toString());
      this.dismissLoading();
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
      this.presentError(error.toString());
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

  onShareClick(casque:any) {
    console.log('CasquesPages.onShareClick');
    const el:HTMLElement = document.createElement('textarea');
    el.innerHTML = '"' + casque.title + ' - ' + casque.artist + '" sur Faubourg Simone (@FaubourgSimone)';
    console.log(casque);
    const options = {
      message: el.innerHTML,
      subject: casque.title + 'sur Faubourg Simone', // fi. for email
      files: [], // an array of filenames either locally or remotely
      url: casque.permalink,
      chooserTitle: 'Choisis une application' // Android only, you can override the default share sheet title
    };
    this.socialSharing.shareWithOptions( options ).then(() => {
      console.log("Shared !")
    }).catch(() => {
      console.log("Not Shared !")
    });
  }

  ionViewWillLeave() {
    this.dismissLoading();
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
