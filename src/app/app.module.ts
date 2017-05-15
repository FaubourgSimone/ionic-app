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


const cloudSettings: CloudSettings = {
    'core': {
        'app_id': '2660e52d'
    }
};

const tabSettings = {
    // tabsLayout: 'title-hide',
    tabsHighlight: true
};

@NgModule({
    declarations: [
        FbrgSmnApp,
        ...Pages,
        ...CustomComponents,
        ...ExternalComponents
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(FbrgSmnApp, tabSettings),
        CloudModule.forRoot(cloudSettings),
        SwingModule,
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
