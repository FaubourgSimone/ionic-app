import {Component, ViewChild} from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { Deploy } from '@ionic/cloud-angular';
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { TranslateService } from "ng2-translate";

import { RadioPage }    from '../pages/radio/radio';
import { PolaPage }     from '../pages/pola/pola';
import { CalepinsPage } from '../pages/calepins/calepins';
import { CasquesPage }  from '../pages/casques/casques';
// import { ConcertsPage } from "./concerts/concerts";

@Component({
    templateUrl: 'app.html'
})
export class FbrgSmnApp {

    @ViewChild(Nav) nav: Nav;
    rootPage:any = TabsPage;
    pages: Array<{title: string, component: any, tabIndex:number}>;

    constructor(platform: Platform,
                statusBar: StatusBar,
                splashScreen: SplashScreen,
                public deploy: Deploy,
                private ga:GoogleAnalytics,
                translate: TranslateService) {
        platform.ready().then(() => {

            statusBar.hide();
            statusBar.overlaysWebView(false);

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

        this.pages = [
            { title: 'Radio', component: RadioPage, tabIndex: 0},
            { title: 'Pola', component: PolaPage, tabIndex: 1 },
            { title: 'Calepin', component: CalepinsPage, tabIndex: 2 },
            { title: 'Casque', component: CasquesPage, tabIndex: 3 }
        ];
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        // this.nav.push(page.component);
        // The active page is
        this.nav.getActiveChildNav().select(page.tabIndex)
    }
}
