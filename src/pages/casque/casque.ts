import { NavParams, ViewController, Platform } from 'ionic-angular';
import { InAppBrowser }     from 'ionic-native';
import { Component }        from '@angular/core';
import { DomSanitizer }     from "@angular/platform-browser";
import { GoogleAnalytics }  from "@ionic-native/google-analytics";
import { CasquesService }   from "../../providers/casques-service";
import { PromptService }    from "../../providers/prompt-service";

@Component({
    selector: 'page-casque',
    templateUrl: 'casque.html'
})
export class CasquePage {

    private postId:string;
    private casque:any;

    constructor(private viewCtrl: ViewController,
                public navParams: NavParams,
                private api: CasquesService,
                private domSanitizer: DomSanitizer,
                private ga: GoogleAnalytics,
                private plt: Platform,
                private prompt: PromptService) {

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
        this.ga.trackEvent('Cliquer sur le permalink', 'Naviguer dans les casques', this.casque.permalink);
        this.navigateTo(this.casque.permalink);
    }

    onPreviewLink(url) {
        this.ga.trackEvent('Cliquer sur la preview', 'Naviguer dans les casques', url);
        this.navigateTo(url);
    }
    onBuyLink(url) {
        this.ga.trackEvent('Cliquer sur acheter', 'Naviguer dans les casques', url);
        this.navigateTo(url);
    }

    navigateTo(url) {
        new InAppBrowser(url, '_system', {
            // location: 'yes',
            // clearcache: 'yes',
            // hardwareback: 'no'
        });
    }

    ionViewWillLeave() {
        this.prompt.dismissLoading();
    }
}
