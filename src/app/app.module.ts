// Angular libs
import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';

// Ionic libs
import { IonicApp, IonicModule}         from 'ionic-angular';
import { CloudSettings, CloudModule }   from '@ionic/cloud-angular';

// Main
import { FbrgSmnApp } from './app.component';

// Pages
import { Pages } from "../pages/index";

// Providers
import { CustomProviders, ExternalProviders } from "../providers/index";

// Components
import { CustomComponents, ExternalComponents } from "../components/index";

// Libs
import { SwingModule }      from 'angular2-swing';
import { IonicAudioModule } from 'ionic-audio';
// import { TranslateModule, TranslateLoader }  from "@ngx-translate/core";
import { ParallaxHeader }   from "../components/parallax-header/parallax-header";

import { HttpModule, Http } from '@angular/http';
// import { IonicApp, IonicModule } from 'ionic-angular';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';

const cloudSettings: CloudSettings = {
    'core': {
        'app_id': '2660e52d'
    }
};

const tabSettings = {
    // tabsLayout: 'title-hide',
    tabsHighlight: true
};

export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
    declarations: [
        FbrgSmnApp,
        ...Pages,
        ...CustomComponents,
        ...ExternalComponents,
        ParallaxHeader
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(FbrgSmnApp, tabSettings),
        CloudModule.forRoot(cloudSettings),
        SwingModule,
        HttpModule,
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [Http]
        }),
        IonicAudioModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        FbrgSmnApp,
        ...Pages,
        ...CustomComponents,
        ...ExternalComponents
    ],
    providers: [
        ...CustomProviders,
        ...ExternalProviders
    ]
})
export class AppModule {}


