import { Directive, ElementRef } from '@angular/core';
import { ModalController} from "ionic-angular";
import { InAppBrowser, InAppBrowserObject } from "@ionic-native/in-app-browser";
import { AppRate } from "@ionic-native/app-rate";
import { SocialSharing } from "@ionic-native/social-sharing";
import { CreditsPage } from "../../pages/credits/credits";

@Directive({
    selector: '[main-menu]'
})
export class MainMenu {

    private browserPopup:InAppBrowserObject;

    constructor(public element: ElementRef,
                private iab: InAppBrowser,
                private appRate: AppRate,
                private socialSharing: SocialSharing,
                public modalCtrl: ModalController) {
        console.log('Hello MainMenu Directive');
    }

    ngOnInit(){
        const content = this.element.nativeElement.getElementsByClassName('scroll-content')[0];
        const socialLinks = content.getElementsByClassName('ts-btn-social');
        const otherLinks = content.getElementsByClassName('ts-btn-link');

        for (let i = 0, l = socialLinks.length; i < l; i++) {
            socialLinks[i].addEventListener('click', (event:MouseEvent)=>this.onSocialLink(event));
        }

        for (let i = 0, l = otherLinks.length; i < l; i++) {
            otherLinks[i].addEventListener('click', (event:MouseEvent) => this.onOtherLink(event));
        }

    }


    onSocialLink(event:MouseEvent) {
        const el:HTMLElement = (event.currentTarget as HTMLElement);
        const dataLink:string = el.getAttribute('data-link');
        if (dataLink) {
            this.openUrl(dataLink);
        }
    }

    onOtherLink(event:MouseEvent) {
        const el:HTMLElement = (event.currentTarget as HTMLElement);
        const dataLink:string = el.getAttribute('data-link');
        // TODO
        switch (dataLink) {
            case 'rate':
                try {
                    this.appRate.preferences.storeAppURL = {
                        ios: 'paris.faubourgsimone.radioapp',
                        android: 'market://details?id=paris.faubourgsimone.radioapp'
                        // windows: 'ms-windows-store://review/?ProductId=<store_id>'
                    };
                    this.appRate.promptForRating(true);
                }
                catch (e) {
                    console.log(e);
                }
                break;
            case 'spread':
                this.socialSharing.share(
                    "Télécharge l'appli Faubourg Simone pour écouter la radio et consulter les news musicales",
                    "Application Faubourg Simone",
                    null,
                    "https://urlgeni.us/faubourgsimone-app").then(() => {
                    // if(this.trackingOptions) {
                    //     console.log('[ShareButtonComponent] Tracked sharing: ', this.trackingOptions.category, this.trackingOptions.action, this.trackingOptions.label);
                    //     this.tracker.trackEventWithData(this.trackingOptions.category, this.trackingOptions.action, this.trackingOptions.label);
                    // }
                }).catch((e) => {
                    console.log(e);
                });
                break;
            case 'info':
                let profileModal = this.modalCtrl.create(CreditsPage, { userId: 8675309 });
                profileModal.present();
                break;
            default:
                break;
        }
    }


    openUrl(url) {
        this.browserPopup = this.iab.create(url, '_system');
        // This check is because of a crash when simulated on desktop browser
        if(typeof this.browserPopup.on('loadstop').subscribe === 'function' ) {
            this.browserPopup.on('loadstop').subscribe((evt)=>{
                if(evt.url === 'https://www.facebook.com/dialog/return/close?#_=_') {
                    this.closePopUp();
                }
            });
        }
    }


    closePopUp() {
        this.browserPopup.close();
    }

}
