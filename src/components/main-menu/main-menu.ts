import { Directive, ElementRef } from '@angular/core';
import {ActionSheetController, AlertController} from "ionic-angular";
import {InAppBrowser, InAppBrowserObject} from "@ionic-native/in-app-browser";

@Directive({
    selector: '[main-menu]',
    host: {
        // '(click)': 'onClick($event)'
    }
})
export class MainMenu {

    private browserPopup:InAppBrowserObject;

    constructor(public element: ElementRef,
                public alertCtrl: AlertController,
                private iab: InAppBrowser,
                public actionSheetCtrl: ActionSheetController) {
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

        // TODO : open apps
        let linkToOpen:string = null;
        switch (dataLink) {
            case 'fb':
                linkToOpen = 'https://urlgeni.us/facebook/faubourgsimone';
                break;
            case 'tw':
                linkToOpen = 'https://urlgeni.us/twitter/faubourgsimone';
                break;
            case 'insta':
                linkToOpen = 'https://urlgeni.us/instagram/faubourgsimone';
                break;
            case 'scd':
                linkToOpen = 'https://urlgeni.us/soundcloud/faubourgsimone';
                break;
            case 'msg':
                linkToOpen = 'https://urlgeni.us/fb_messenger/faubourgsimone';
                break;
            default:
                break;
        }

        if (linkToOpen) {
            this.openUrl(linkToOpen);
        }
    }

    onOtherLink(event:MouseEvent) {
        const el:HTMLElement = (event.currentTarget as HTMLElement);
        const dataLink:string = el.getAttribute('data-link');
        // TODO
        switch (dataLink) {
            case 'contact':
                this.openUrl('mailto:contact@faubourgsimone.paris');
                break;
            case 'note':
                this.showAlert('NOTE', 'Ouvrir une popin permettant de noter l\'app');
                break;
            case 'spread':
                // https://urlgeni.us/faubourgsimone-app
                this.showAlert('RECOMMANDER A UN AMI', 'Ouvrir un partage de lien vers le store');
                break;
            case 'info':
                this.showAlert('A PROPOS', 'Ouvrir une modal avec les mentions legales et les credits');
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

    showAlert(title:string, message:string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['Fermer']
        });
        alert.present();
    }

    // onClick(e) {
    // console.log(this.element);
    // console.log('ONCLICK');
    // }

}
