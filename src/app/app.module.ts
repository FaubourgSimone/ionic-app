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

import { MovieListPage } from '../pages/movie-list/movie-list';
import { MovieInfoPage } from '../pages/movie-info/movie-info';

@NgModule({
  declarations: [
    MyApp,
    PolaPage,
    CalepinsPage,
    RadioPage,
    CasquePage,
    TabsPage,
    MovieListPage,
    MovieInfoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PolaPage,
    CalepinsPage,
    RadioPage,
    CasquePage,
    TabsPage,
    MovieListPage,
    MovieInfoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    RadioPlayer,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
