import { GlobalService }    from './global-service';
import { InitService }      from "./init-service";
import { RadioService }     from "./radio-service";
import { CalepinsService }  from "./calepins-service";
import { CasquesService }   from "./casques-service";
import { PromptService }    from "./prompt-service";

import { StatusBar }                from "@ionic-native/status-bar";
import { SplashScreen }             from "@ionic-native/splash-screen";
import { ErrorHandler, LOCALE_ID }  from '@angular/core';
import { IonicErrorHandler }        from 'ionic-angular';
import { SocialSharing }            from "@ionic-native/social-sharing";
import { GoogleAnalytics }          from "@ionic-native/google-analytics";

export const CustomProviders = [
    InitService,
    GlobalService,
    RadioService,
    CalepinsService,
    CasquesService,
    PromptService
];

export const ExternalProviders = [
    StatusBar,
    SplashScreen,
    SocialSharing,
    GoogleAnalytics,
    { provide: LOCALE_ID, useValue: "fr-FR" },
    { provide: ErrorHandler, useClass: IonicErrorHandler }
];