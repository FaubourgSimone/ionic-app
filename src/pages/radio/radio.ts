import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RadioPlayer } from '../../providers/radioplayer';
import { InformationService } from '../../services/information';

@Component({
  selector: 'page-radio',
  templateUrl: 'radio.html',
  providers: [InformationService]
})
export class RadioPage {

  private streaming_url:string = 'http://91.121.65.131:1337/faubourgsimone';

  constructor(public navCtrl: NavController, private player:RadioPlayer, private informationService:InformationService) {

    this.informationService.getInitData().subscribe(
        // Success
        data => {
          console.log('Data received');
          this.streaming_url = data.streaming_url ? data.streaming_url : this.streaming_url;
          this.player.init(this.streaming_url);
        },
        // Failure
        err => {
          this.player.init(this.streaming_url);
        }
    );
  }

  play() {
    console.log('Waiting For Streaming');
    this.player.play().then(() => {
      console.log('Start Playing');
    });
  }

  pause() {
    this.player.pause();
  }

}
