import { Component, Input } from '@angular/core';
import { GoogleAnalytics }  from "@ionic-native/google-analytics";
import { InAppBrowser }     from 'ionic-native';
import { TrackerService }   from "../../providers/tracker-service";

@Component({
  selector: 'row-links-casque',
  templateUrl: 'row-links-casque.html'
})
export class RowLinksCasqueComponent {

  @Input() casque:any;

  constructor(private ga: GoogleAnalytics,
              private tracker:TrackerService) {
    console.log('Hello RowLinksCasque Component');
  }

  onPreviewLink(url) {
    this.tracker.trackEventWithI18n(
        { translate: 'TRACKING.CASQUES.CATEGORY' },
        { translate: 'TRACKING.CASQUES.ACTION.CLICK_PREVIEW' },
        { translate: 'TRACKING.CASQUES.LABEL.CLICK_PREVIEW', params: { url } }
    );
    this.navigateTo(url);
  }
  onBuyLink(url) {
    this.tracker.trackEventWithI18n(
        { translate: 'TRACKING.CASQUES.CATEGORY' },
        { translate: 'TRACKING.CASQUES.ACTION.CLICK_BUY' },
        { translate: 'TRACKING.CASQUES.LABEL.CLICK_BUY', params: { url } }
    );
    this.navigateTo(url);
  }

  navigateTo(url) {
    new InAppBrowser(url, '_system', {});
  }

}
