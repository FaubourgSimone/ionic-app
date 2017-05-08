import { Component } from '@angular/core';
import { NavController, ViewController, Platform } from 'ionic-angular';
import { CasquesService } from "../../providers/casques-service";
import { CasquePage } from "../casque/casque";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import {PromptService} from "../../providers/prompt-service";

@Component({
    selector: 'page-casques',
    templateUrl: 'casques.html'
})
export class CasquesPage {

    private casques:any;
    private reloadNb:number = 0;

    constructor(public navCtrl: NavController,
                private viewCtrl: ViewController,
                private api: CasquesService,
                private ga: GoogleAnalytics,
                private plt: Platform,
                private prompt: PromptService) {

        this.plt.ready().then((readySource) => {
            console.log('Platform ready from', readySource);
            this.ga.trackView(this.viewCtrl.name);
        });

    }

    ionViewDidLoad() {
        this.api.getCasques().then((data)=>{
            this.casques = data;
            this.prompt.dismissLoading();
        }).catch((error)=>{
            this.prompt.presentError(error.toString());
            this.prompt.dismissLoading();
        });
    }

    ionViewDidEnter() {
        if(typeof this.casques === 'undefined') {
            this.prompt.presentLoading();
        }
    }

    navToCasque(id:number) {
        this.ga.trackEvent('Ouvrir un casque', 'Naviguer dans les casques', 'casque-' + id.toString());
        this.navCtrl.push(CasquePage, {
            postId: id
        });
    }

    doInfinite(infiniteScroll) {
        this.reloadNb++;
        this.ga.trackEvent('Charger les casques suivants', 'Naviguer dans les casques', 'refill-casque-' + this.reloadNb.toString());
        this.api.getCasques().then((data:any)=>{
            for (let i = 0, l=data.length; i < l; i++) {
                this.casques.push( data[i] );
            }
            infiniteScroll.complete();
        }).catch((error)=>{
            this.prompt.presentError(error.toString());
        });
    }

    ionViewWillLeave() {
        this.prompt.dismissLoading();
    }
}
