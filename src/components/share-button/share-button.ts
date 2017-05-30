import { Component, Input } from '@angular/core';
import { GoogleAnalytics }  from "@ionic-native/google-analytics";
import { SocialSharing }    from "@ionic-native/social-sharing";
import { PromptService }    from "../../providers/prompt-service";
import { TrackerService }   from "../../providers/tracker-service";
import { Screenshot }       from "@ionic-native/screenshot";

@Component({
    selector: 'share-button',
    templateUrl: 'share-button.html'
})

export class ShareButtonComponent {

    @Input() options:any;
    @Input() trackingOptions:any;
    @Input() hasLabel:boolean;
    @Input() doScreenShot:boolean;

    constructor(private ga: GoogleAnalytics,
                private socialSharing: SocialSharing,
                private prompt:PromptService,
                private tracker: TrackerService,
                private screenshot: Screenshot) {
    }

    onClick() {
        if(this.doScreenShot) {
            this.screenshot.URI(80).then(
                (result)=> {
                    this.options.image = result.URI;
                    this.shareIt(this.options);
                },
                (error)=> {
                    console.log('error: ', error);
                    this.prompt.presentMessage({message: `Une erreur s'est produite lors de la screenshot : \n ${error.toString()}`, classNameCss:'error'});
                });
        }
        else {
            this.shareIt(this.options);
        }
    }

    shareIt(options) {
        this.socialSharing.share(
            options.message || null,
            options.subject || null,
            options.image || null,
            options.url || null ).then(() => {
            if(this.trackingOptions) {
                console.log('[ShareButtonComponent] Tracked sharing: ', this.trackingOptions.category, this.trackingOptions.action, this.trackingOptions.label);
                this.tracker.trackEventWithData(this.trackingOptions.category, this.trackingOptions.action, this.trackingOptions.label);
            }
        }).catch((e) => {
            if(this.trackingOptions) {
                this.prompt.presentMessage({message: `Une erreur s'est produite pour partager ${this.trackingOptions.label}: \n ${e.toString()}`, classNameCss:'error'});
            }
        });
    }
}
