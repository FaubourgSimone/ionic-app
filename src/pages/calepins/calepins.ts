import { Component } from '@angular/core';
import { NavController, Loading, LoadingController, ViewController, Platform } from 'ionic-angular';
import { CalepinsService } from "../../providers/calepins-service";
import { CalepinPage } from "../calepin/calepin";
import { CustomErrorHandler } from "../../components/custom-error-handler";
import { GlobalService } from "../../providers/global-service";

@Component({
  selector: 'page-calepins',
  templateUrl: 'calepins.html'
})
export class CalepinsPage {

  private calepins:any;
  private loader:Loading;

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public plt: Platform,
              private api:CalepinsService,
              private loadingCtrl: LoadingController,
              private errorHandler:CustomErrorHandler,
              private vars: GlobalService) {
    // this.plt.ready().then((readySource) => {
    //   console.log('Platform ready from', readySource);
    //   // Platform now ready, execute any required native code
    //   this.plt.registerBackButtonAction(()=> {
    //     let nav = this.viewCtrl.getNav();
    //     // let activeView: ViewController = nav.getActiveChildNav();
    //     if(this.viewCtrl != null){
    //       if(nav.canGoBack()) {
    //         nav.pop();
    //       }else if (typeof this.viewCtrl.instance.backButtonAction === 'function')
    //         this.viewCtrl.instance.backButtonAction();
    //       else nav.parent.select(0); // goes to the first tab
    //     }
    //   })
    // });
  }

  ionViewDidLoad() {
    // this.presentLoading();
    this.api.getCalepins().then((data)=>{
      this.calepins = data;
      this.dismissLoading();
    }).catch((error)=>{
      this.errorHandler.handleError(error);
    });
  }

  ionViewDidEnter() {
    if(typeof this.calepins === 'undefined') {
      this.presentLoading();
    }
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    this.api.getCalepins().then((data:any)=>{
      console.log(data);
      for (let i = 0, l=data.length; i < l; i++) {
        this.calepins.push( data[i] );
      }
      infiniteScroll.complete();
    }).catch((error)=>{
      this.errorHandler.handleError(error);
    });
  }

  navToCalepin(id:number) {
    console.log('CalepinsPage.navToCalepin: ', id);
    this.navCtrl.push(CalepinPage, {
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
