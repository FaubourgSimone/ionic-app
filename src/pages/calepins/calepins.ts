import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CalepinsService } from "../../providers/calepins-service";
import { CalepinPage } from "../calepin/calepin";
import { CustomErrorHandler } from "../../components/custom-error-handler";

@Component({
  selector: 'page-calepins',
  templateUrl: 'calepins.html'
})
export class CalepinsPage {

  private calepins:any;

  constructor(public navCtrl: NavController,
              private api:CalepinsService,
              private errorHandler:CustomErrorHandler) {
    this.api.getCalepins().then((data)=>{
      this.calepins = data;
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

}
