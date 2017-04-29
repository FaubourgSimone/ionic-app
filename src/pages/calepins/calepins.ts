import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CalepinsService } from "../../providers/calepins-service";

@Component({
  selector: 'page-calepins',
  templateUrl: 'calepins.html'
})
export class CalepinsPage {

  private calepins:{ id:number, title:string, subtitle:string, thumbnail:string }[];

  constructor(public navCtrl: NavController, private api:CalepinsService) {
    this.api.getCalepins().then((data)=>{
      this.calepins = data;
      console.log(this.calepins);
    }).catch((error)=>this.errorHandling(error));
  }

  navToCalepin(id:number) {
    console.log('CalepinPage.navToCalepin: ', id);
  }

  errorHandling(error:Error) {
    // TODO Afficher un message d'erreur
    console.log('PageCalepin.errorHandling: ', error.message);
  }

}
