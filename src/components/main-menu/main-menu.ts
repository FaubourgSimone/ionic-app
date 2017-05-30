import {Directive, ElementRef} from '@angular/core';
import {AlertController} from "ionic-angular";

@Directive({
    selector: '[main-menu]',
    host: {
        // '(click)': 'onClick($event)'
    }
})
export class MainMenu {

    constructor(public element: ElementRef, public alertCtrl: AlertController) {
        console.log('Hello MainMenu Directive');
    }

    ngOnInit(){

        let content = this.element.nativeElement.getElementsByClassName('scroll-content')[0];
        let socialLinks = content.getElementsByClassName('ts-btn-social');
        let otherLinks = content.getElementsByClassName('ts-btn-link');



        for (let i=0,l=socialLinks.length; i<l; i++) {
            let el = socialLinks[i];
            el.addEventListener('click', (ev:MouseEvent) => {
                const el:HTMLElement = (event.currentTarget as HTMLElement);
                const dataLink:string = el.getAttribute('data-link');

                // TODO : open apps
                switch (dataLink) {
                    case 'fb':
                        this.showAlert('FACEBOOK', 'Ouvrir un lien vers la page facebook');
                        break;
                    case 'tw':
                        this.showAlert('TWITTER', 'Ouvrir un lien vers la page twitter');
                        break;
                    case 'insta':
                        this.showAlert('INSTAGRAM', 'Ouvrir un lien vers la page instagram');
                        break;
                    case 'scd':
                        this.showAlert('SOUNDCLOUD', 'Ouvrir un lien vers la page soundcloud');
                        break;
                    default:
                        break;
                }

            });
        }


        for (let i=0,l=otherLinks.length; i<l; i++) {
            let el = otherLinks[i];
            el.addEventListener('click', (ev:MouseEvent) => {
                const el:HTMLElement = (event.currentTarget as HTMLElement);
                const dataLink:string = el.getAttribute('data-link');

                // TODO
                switch (dataLink) {
                    case 'contact':
                        this.showAlert('CONTACT', 'Ouvrir un mail adressé a contact@faubourgsimone.com');
                        break;
                    case 'note':
                        this.showAlert('NOTE', 'Ouvrir une popin permettant de noter l\'app');
                        break;
                    case 'spread':
                        this.showAlert('RECOMMANDER A UN AMI', 'Ouvrir un partage de lien vers le store');
                        break;
                    case 'info':
                        this.showAlert('A PROPOS', 'Ouvrir une modal avec les mentions legales et les credits');
                        break;
                    default:
                        break;
                }
            });
        }

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
