import { NavController, ViewController, Platform } from 'ionic-angular';
import { Component }        from '@angular/core';
import { GoogleAnalytics }  from "@ionic-native/google-analytics";
import { CasquesService }   from "../../providers/casques-service";
import { PromptService }    from "../../providers/prompt-service";
import { CasquePage }       from "../casque/casque";
import { TrackerService }   from "../../providers/tracker-service";

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
                private prompt: PromptService,
                private tracker:TrackerService) {

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
            this.prompt.presentMessage({message: error.toString(), classNameCss: 'error'});
            this.prompt.dismissLoading();
        });
    }

    ionViewDidEnter() {
        if(typeof this.casques === 'undefined') {
            this.prompt.presentLoading();
        }
    }

    navToCasque(id:number) {
        this.tracker.trackEvent(
            { translate: 'TRACKING.CASQUES.CATEGORY' },
            { translate: 'TRACKING.CASQUES.ACTION.OPEN' },
            { translate: 'TRACKING.CASQUES.LABEL.OPEN', params: { id: id.toString() } }
        );
        this.navCtrl.push(CasquePage, {
            postId: id
        });
    }

    doInfinite(infiniteScroll) {
        this.reloadNb++;
        this.api.getCasques().then((data:any)=>{
            for (let i = 0, l=data.length; i < l; i++) {
                this.casques.push( data[i] );
            }
            this.tracker.trackEvent(
                { translate: 'TRACKING.CASQUES.CATEGORY' },
                { translate: 'TRACKING.CASQUES.ACTION.LOAD' },
                { translate: 'TRACKING.CASQUES.LABEL.LOAD', params: { time: this.reloadNb.toString() } }
            );
            infiniteScroll.complete();
        }).catch((error)=>{
            this.prompt.presentMessage({message: error.toString(), classNameCss: 'error'});
        });
    }

    ionViewWillLeave() {
        this.prompt.dismissLoading();
    }
}
