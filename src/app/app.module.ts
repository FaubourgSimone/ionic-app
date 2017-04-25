import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { PolaPage } from '../pages/pola/pola';
import { CalepinsPage } from '../pages/calepins/calepins';
import { RadioPage } from '../pages/radio/radio';
import { CasquePage } from '../pages/casque/casque';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { RadioPlayer } from '../providers/radioplayer';

import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import { SwingModule } from 'angular2-swing';

import { GlobalVars } from '../providers/global-variables';



const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '0f7b6934'
  }
};

@NgModule({
  declarations: [
    MyApp,
    PolaPage,
    CalepinsPage,
    RadioPage,
    CasquePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    SwingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PolaPage,
    CalepinsPage,
    RadioPage,
    CasquePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GlobalVars,
    RadioPlayer,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
