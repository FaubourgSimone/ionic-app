import { NavParams, ViewController, Platform } from 'ionic-angular';
import { Component }        from '@angular/core';
import { DomSanitizer }     from "@angular/platform-browser";
import { GoogleAnalytics }  from "@ionic-native/google-analytics";
import { CalepinsService }  from "../../providers/calepins-service";
import { PromptService }    from "../../providers/prompt-service";


@Component({
    selector: 'page-calepin',
    templateUrl: 'calepin.html'
})
export class CalepinPage {

    private postId:string;
    private calepin:any;

    constructor(private viewCtrl: ViewController,
                public navParams: NavParams,
                private api: CalepinsService,
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
        this.api.getCalepin(this.postId).then((data:any)=>{
            data.content = this.domSanitizer.bypassSecurityTrustHtml(data.content);
            this.calepin = data;
            this.prompt.dismissLoading();
        }).catch((error)=>{
            this.prompt.presentError(error.toString());
            this.prompt.dismissLoading();
        });
    }

    ionViewDidEnter() {
        if(typeof this.calepin === 'undefined') {
            this.prompt.presentLoading();
        }
    }

    onExternalLink() {
        this.ga.trackEvent('Cliquer sur le permalink', 'Naviguer dans les calepins', this.calepin.permalink);
    }

    ionViewWillLeave() {
        this.prompt.dismissLoading();
    }

}
