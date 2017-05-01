import { NgModule, ErrorHandler, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import { MyApp } from './app.component';

import { PolaPage } from '../pages/pola/pola';
import { CalepinsPage } from '../pages/calepins/calepins';
import { CalepinPage } from "../pages/calepin/calepin";
import { CasquesPage } from '../pages/casques/casques';
import { CasquePage } from '../pages/casque/casque';
import { RadioPage } from '../pages/radio/radio';
import { TabsPage } from '../pages/tabs/tabs';
import { ConcertsPage } from "../pages/concerts/concerts";

import { StatusBar,  } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import { SwingModule } from 'angular2-swing';

import { GlobalService } from '../providers/global-service';
import { InitService } from "../providers/init-service";
import { RadioService } from "../providers/radio-service";
import { CalepinsService } from "../providers/calepins-service";
import { CasquesService } from "../providers/casques-service";
import { RadioPlayer } from '../providers/radioplayer';

import { CustomErrorHandler } from "../components/custom-error-handler";


const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '0f7b6934'
  }
};

@NgModule({
  declarations: [
    MyApp,
    RadioPage,
    PolaPage,
    CalepinsPage,
    CasquesPage,
    CalepinPage,
    CasquePage,
    ConcertsPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, []),
    CloudModule.forRoot(cloudSettings),
    SwingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RadioPage,
    PolaPage,
    CalepinsPage,
    CasquesPage,
    CalepinPage,
    CasquePage,
    ConcertsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GlobalService,
    InitService,
    RadioService,
    RadioPlayer,
    CalepinsService,
    CasquesService,
    CustomErrorHandler,
    { provide: LOCALE_ID, useValue: "fr-FR" },
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
