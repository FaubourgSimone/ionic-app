import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { Deploy } from '@ionic/cloud-angular';
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import {TranslateService} from "ng2-translate";

@Component({
    template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class FbrgSmnApp {

    // @ViewChild(Nav) nav: Nav;
    rootPage:any = TabsPage;

    constructor(platform: Platform,
                statusBar: StatusBar,
                splashScreen: SplashScreen,
                public deploy: Deploy,
                private ga:GoogleAnalytics,
                translate: TranslateService) {
        platform.ready().then(() => {

            statusBar.styleDefault();
            splashScreen.hide();

            // this language will be used as a fallback when a translation isn't found in the current language
            translate.setDefaultLang('fr');
            // the lang to use, if the lang isn't available, it will use the current loader to get them
            translate.use('fr');

            // Connect to the native Google's Universal Analytics SDK 3.0
            this.ga.startTrackerWithId('UA-31158767-3')
                .then(() => {
                    console.log('Google analytics is ready now');
                    //the component is ready and you can call any method here
                    this.ga.debugMode();
                    this.ga.setAllowIDFACollection(true);
                    this.ga.enableUncaughtExceptionReporting(true);
                })
                .catch(e => console.log('Error starting GoogleAnalytics', e));
        });
    }
}
