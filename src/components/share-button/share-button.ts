import { Component, Input } from '@angular/core';
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { SocialSharing } from "@ionic-native/social-sharing";

@Component({
  selector: 'share-button',
  templateUrl: 'share-button.html'
})

export class ShareButtonComponent {

  @Input() options:any;
  @Input() trackingOptions:any;
  @Input() hasLabel:boolean;

  constructor(private ga: GoogleAnalytics,
              private socialSharing: SocialSharing) {
  }

  onClick() {
    this.options.chooserTitle = 'Choisis une application'; // Android only, you can override the default share sheet title
    this.socialSharing.shareWithOptions( this.options ).then(() => {
      console.log('[ShareButtonComponent] Shared: ', this.trackingOptions.category, this.trackingOptions.action, this.trackingOptions.label);
      if(this.trackingOptions) {
        this.ga.trackEvent(this.trackingOptions.category, this.trackingOptions.action, this.trackingOptions.label);
      }
    }).catch(() => {

      if(this.trackingOptions) {
        console.log('[ShareButtonComponent] Error when sharing: ', this.trackingOptions.category, 'Erreur', this.trackingOptions.label);
        this.ga.trackEvent(this.trackingOptions.category, 'Erreur', this.trackingOptions.label);
      }
    });

  }

}
