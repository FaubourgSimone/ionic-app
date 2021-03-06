import { NavParams, ViewController, Platform, NavController } from 'ionic-angular';
import { InAppBrowser }     from 'ionic-native';
import { Component }        from '@angular/core';
import { DomSanitizer }     from "@angular/platform-browser";
import { GoogleAnalytics }  from "@ionic-native/google-analytics";
import { CalepinsService }  from "../../providers/calepins-service";
import { PromptService }    from "../../providers/prompt-service";
import { TrackerService }   from "../../providers/tracker-service";


@Component({
    selector: 'page-calepin',
    templateUrl: 'calepin.html'
})
export class CalepinPage {

    private postId:string;
    private calepin:any;

    constructor(public navCtrl: NavController,
                private viewCtrl: ViewController,
                public navParams: NavParams,
                private api: CalepinsService,
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
        this.api.getCalepin(this.postId).then((data:any)=>{
            data.content = this.domSanitizer.bypassSecurityTrustHtml(data.content);
            this.calepin = data;
            this.prompt.dismissLoading();
        }).catch((error)=>{
            this.prompt.presentMessage({message: error.toString(), classNameCss:'error'});
            this.prompt.dismissLoading();
        });
    }

    ionViewDidEnter() {
        if(typeof this.calepin === 'undefined') {
            this.prompt.presentLoading();
        }
    }

    onExternalLink() {
        this.tracker.trackEventWithI18n(
            { translate: 'TRACKING.CALEPINS.CATEGORY' },
            { translate: 'TRACKING.CALEPINS.ACTION.GET_PERMALINK' },
            { translate: 'TRACKING.CALEPINS.LABEL.GET_PERMALINK', params: { permalink: this.calepin.permalink } }
        );
        this.navigateTo(this.calepin.permalink);
    }

    navigateTo(url) {
        new InAppBrowser(url, '_system', {});
    }

    ionViewWillLeave() {
        this.prompt.dismissLoading();
    }

}
