import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {CalepinsService} from "../../providers/calepins-service";

@Component({
  selector: 'page-calepins',
  templateUrl: 'calepins.html'
})
export class CalepinsPage {

  constructor(public navCtrl: NavController, private api:CalepinsService) {
    // this.api.getCalepins().then((data)=>console.log(data));

  }



}
