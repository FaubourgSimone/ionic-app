import { NavParams, ViewController, Platform, NavController } from 'ionic-angular';
import { InAppBrowser }     from 'ionic-native';
import { Component }        from '@angular/core';
import { DomSanitizer }     from "@angular/platform-browser";
import { GoogleAnalytics }  from "@ionic-native/google-analytics";
import { CasquesService }   from "../../providers/casques-service";
import { PromptService }    from "../../providers/prompt-service";
import { TrackerService }   from "../../providers/tracker-service";

@Component({
    selector: 'page-casque',
    templateUrl: 'casque.html'
})
export class CasquePage {

    private postId:string;
    private casque:any;

    constructor(public navCtrl: NavController,
                private viewCtrl: ViewController,
                public navParams: NavParams,
                private api: CasquesService,
                private domSanitizer: DomSanitizer,
                private ga: GoogleAnalytics,
                private plt: Platform,
                private prompt: PromptService,
                private tracker: TrackerService) {

        this.plt.ready().then((readySource) => {
            console.log('Platform ready from', readySource);
            this.ga.trackView(this.viewCtrl.name);
        });

        this.postId = this.navParams.get('postId');
    }

    ionViewDidLoad() {
        this.api.getCasque(this.postId).then((data:any)=>{
            data.content = this.domSanitizer.bypassSecurityTrustHtml(data.content);
            this.casque = data;
            this.prompt.dismissLoading();
        }).catch((error)=>{
            this.prompt.presentMessage({message: error.toString(), classNameCss: 'error'});
            this.prompt.dismissLoading();
        });
    }

    ionViewDidEnter() {
        if(typeof this.casque === 'undefined') {
            this.prompt.presentLoading();
        }
    }

    onExternalLink() {
        this.tracker.trackEvent(
            { translate: 'TRACKING.CASQUES.CATEGORY' },
            { translate: 'TRACKING.CASQUES.ACTION.GET_PERMALINK' },
            { translate: 'TRACKING.CASQUES.LABEL.GET_PERMALINK', params: { permalink: this.casque.permalink } }
        );
        this.navigateTo(this.casque.permalink);
    }

    navigateTo(url) {
        new InAppBrowser(url, '_system', {});
    }

    ionViewWillLeave() {
        this.prompt.dismissLoading();
    }
}
