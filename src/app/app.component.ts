import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { Deploy } from '@ionic/cloud-angular';
import { GoogleAnalytics } from "@ionic-native/google-analytics";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

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
    });
  }
}
