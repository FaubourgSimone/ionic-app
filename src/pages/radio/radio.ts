import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RadioPlayer } from '../../providers/radioplayer';

@Component({
  selector: 'page-radio',
  templateUrl: 'radio.html'
})
export class RadioPage {

  player:any;

  constructor(public navCtrl: NavController, player:RadioPlayer) {
    this.player = player;

  }

  play() {
    this.player.play().then(() => {
      console.log('Playing');
    });
  }

  pause() {
    this.player.pause();
  }

}
