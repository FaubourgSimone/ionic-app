import { Component, Input } from '@angular/core';
import { GoogleAnalytics }  from "@ionic-native/google-analytics";
import { InAppBrowser }     from 'ionic-native';

@Component({
  selector: 'row-links-casque',
  templateUrl: 'row-links-casque.html'
})
export class RowLinksCasqueComponent {

  @Input() casque:any;

  constructor(private ga: GoogleAnalytics) {
    console.log('Hello RowLinksCasque Component');
  }

  onPreviewLink(url) {
    console.log('RowLinksCasque.onPreviewLink: ', url);
    this.ga.trackEvent('Cliquer sur la preview', 'Naviguer dans les casques', url);
    this.navigateTo(url);
  }
  onBuyLink(url) {
    console.log('RowLinksCasque.onBuyLink: ', url);
    this.ga.trackEvent('Cliquer sur acheter', 'Naviguer dans les casques', url);
    this.navigateTo(url);
  }

  navigateTo(url) {
    new InAppBrowser(url, '_system', {});
  }

}
