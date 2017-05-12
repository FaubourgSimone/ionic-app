import {Component, ViewChild} from '@angular/core';
import {Nav, Platform, ViewController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { Deploy } from '@ionic/cloud-angular';
import { GoogleAnalytics } from "@ionic-native/google-analytics";

@Component({
    template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class FbrgSmnApp {
    rootPage:any = TabsPage;

    @ViewChild(Nav) nav: Nav;

    constructor(platform: Platform,
                statusBar: StatusBar,
                splashScreen: SplashScreen,
                public deploy: Deploy,
                private ga:GoogleAnalytics) {
        platform.ready().then(() => {

            statusBar.styleDefault();
            splashScreen.hide();

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


            // platform.registerBackButtonAction(() => {
            //
            //     // if(this.nav.canGoBack()){
            //     //     console.log('pop');
            //     //     this.nav.pop();
            //     // }else{
            //     //     console.log('heu');
            //     // }
            //
            //
            //     // let nav = app.getActiveNav();
            //     let activeView:ViewController = this.nav.getActive();
            //
            //     if(activeView != null){
            //         console.log('back');
            //         if(this.nav.canGoBack()) {
            //             console.log('pop');
            //             this.nav.pop();
            //         }
            //         else if (typeof activeView.instance.backButtonAction === 'function') {
            //             console.log('heu');
            //             activeView.instance.backButtonAction();
            //         }
            //         else {
            //             console.log('first tab');
            //             // this.nav.parent.select(0); // goes to the first tab
            //         }
            //     }
            // });


        });
    }
}
