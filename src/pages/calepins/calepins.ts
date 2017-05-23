import { NavController, ViewController, Platform } from 'ionic-angular';
import { Component }        from '@angular/core';
import { CalepinsService }  from "../../providers/calepins-service";
import { CalepinPage }      from "../calepin/calepin";
import { GoogleAnalytics }  from "@ionic-native/google-analytics";
import { PromptService }    from "../../providers/prompt-service";
import { TrackerService }   from "../../providers/tracker-service";

@Component({
    selector: 'page-calepins',
    templateUrl: 'calepins.html'
})
export class CalepinsPage {

    private calepins:any;
    private reloadNb:number = 0;

    constructor(public navCtrl: NavController,
                public viewCtrl: ViewController,
                public plt: Platform,
                private api: CalepinsService,
                private ga: GoogleAnalytics,
                private prompt: PromptService,
                private tracker:TrackerService) {

        this.plt.ready().then((readySource) => {
            console.log('Platform ready from', readySource);
            this.ga.trackView(this.viewCtrl.name);
        });

    }

    ionViewDidLoad() {
        this.api.getCalepins().then((data)=>{
            this.calepins = data;
            this.prompt.dismissLoading();
        }).catch((error)=>{
            this.prompt.presentMessage({message: error.toString(), classNameCss: 'error'});
            this.prompt.dismissLoading();
        });
    }

    ionViewDidEnter() {
        if(typeof this.calepins === 'undefined') {
            this.prompt.presentLoading();
        }
    }

    navToCalepin(id:number) {
        this.tracker.trackEvent(
            { translate: 'TRACKING.CALEPINS.CATEGORY' },
            { translate: 'TRACKING.CALEPINS.ACTION.OPEN' },
            { translate: 'TRACKING.CALEPINS.LABEL.OPEN', params: { id: id.toString() } }
        );
        this.navCtrl.push(CalepinPage, {
            postId: id
        });
    }

    doInfinite(infiniteScroll) {
        this.reloadNb++;

        this.api.getCalepins().then((data:any)=>{
            for (let i = 0, l=data.length; i < l; i++) {
                this.calepins.push( data[i] );
            }
            this.tracker.trackEvent(
                { translate: 'TRACKING.CALEPINS.CATEGORY' },
                { translate: 'TRACKING.CALEPINS.ACTION.LOAD' },
                { translate: 'TRACKING.CALEPINS.LABEL.LOAD', params: { time: this.reloadNb.toString() } }
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
