import { ViewController, Platform } from 'ionic-angular';
import { Component }        from '@angular/core';
import { GoogleAnalytics }  from "@ionic-native/google-analytics";

@Component({
    selector: 'page-concerts',
    templateUrl: 'concerts.html'
})
export class ConcertsPage {

    constructor(private viewCtrl:ViewController,
                private ga: GoogleAnalytics,
                private plt: Platform) {

        this.plt.ready().then((readySource) => {
            console.log('Platform ready from', readySource);
            this.ga.trackView(this.viewCtrl.name);
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ConcertsPage');
    }

}
