import { Component, Input } from '@angular/core';
import { GoogleAnalytics }  from "@ionic-native/google-analytics";
import { SocialSharing }    from "@ionic-native/social-sharing";
import { PromptService }    from "../../providers/prompt-service";
import { TrackerService }   from "../../providers/tracker-service";

@Component({
    selector: 'share-button',
    templateUrl: 'share-button.html'
})

export class ShareButtonComponent {

    @Input() options:any;
    @Input() trackingOptions:any;
    @Input() hasLabel:boolean;

    constructor(private ga: GoogleAnalytics,
                private socialSharing: SocialSharing,
                private prompt:PromptService,
                private tracker: TrackerService) {
    }

    onClick() {
        this.options.chooserTitle = 'Choisis une application'; // Android only, you can override the default share sheet title
        this.socialSharing.shareWithOptions( this.options ).then(() => {
            console.log('[ShareButtonComponent] Shared: ', this.trackingOptions.category, this.trackingOptions.action, this.trackingOptions.label);
            if(this.trackingOptions) {
                this.tracker.trackEventWithData(this.trackingOptions.category, this.trackingOptions.action, this.trackingOptions.label);
            }
        }).catch((e) => {

            if(this.trackingOptions) {
                this.prompt.presentMessage({message: `Une erreur s'est produite pour partager ${this.trackingOptions.label}: \n ${e.toString()}`});
            }
        });
    }
}
