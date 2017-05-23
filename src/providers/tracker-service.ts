import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import {TranslateService} from "ng2-translate";

@Injectable()
export class TrackerService {

  constructor(public http: Http,
              private ga: GoogleAnalytics,
              private translateService: TranslateService) {
    console.log('Hello TrackerService Provider');
  }

  trackEventWithI18n(category: {translate:string, params?:any}, action: {translate:string, params?:any}, label: {translate:string, params?:any} ) {
    console.log('TrackerService.trackEventWithI18n');
    let trackingCategory, trackingAction, trackingLabel;
    this.translateService
        .get(category.translate, category.params)
        .flatMap((result: string) => {
          trackingCategory = result;
          return this.translateService.get(action.translate, action.params)
        })
        .flatMap((result: string) => {
          trackingAction = result;
          return this.translateService.get(label.translate, label.params)
        })
        .subscribe((result: string) => {
          trackingLabel = result;
          console.log(trackingCategory, trackingAction, trackingLabel);
          this.ga.trackEvent(trackingCategory, trackingAction, trackingLabel);
        });
  }

  trackEventWithData(...data) {
      console.log('TrackerService.trackEventWithData');
      console.log(data.join());
      // this.ga.trackEvent(data.join());
  }

}
