import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { LoadingController, Loading, AlertController } from 'ionic-angular';
import { GlobalService } from '../../providers/global-service';
import {
    StackConfig,
    DragEvent,
    SwingStackComponent,
    SwingCardComponent
} from 'angular2-swing';
import { PolaService } from "../../providers/pola-service";
import { SocialSharing } from "@ionic-native/social-sharing";

@Component({
    selector: 'page-pola',
    templateUrl: 'pola.html',
    providers: [PolaService]
})
export class PolaPage {
    @ViewChild('myswing1') swingStack: SwingStackComponent;
    @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;

    cards: any;
    stackConfig: StackConfig;
    stackStyle:string = 'stack-style-1';
    private loader:Loading;

    constructor(private vars:GlobalService,
                private loadingCtrl: LoadingController,
                private api:PolaService,
                private alertCtrl:AlertController,
                private socialSharing: SocialSharing) {

        this.stackConfig = {
            throwOutConfidence: (offset, element) => {
                // return Math.min(Math.abs(offset) / (element.offsetWidth / 2), 1);
                return Math.min((2 * Math.abs(offset) / (element.offsetWidth / 2)), 1);
                // return 1;
            },
            transform: (element, x, y, r) => {
                this.onItemMove(element, x, y, r);
            }
            // throwOutDistance: (d) => {
            //   return 800;
            // }
        };
    }

    ionViewDidLoad() {
        // Either subscribe in controller or set in HTML
        this.swingStack.throwin.subscribe((event: DragEvent) => {
            event.target.style.background = '#ffffff';
        });

        this.addNewCards();
    }

    /**
     * Called whenever we drag an element
     * Change background color depending on left or right movement
     * @param element
     * @param x
     * @param y
     * @param r
     */
    onItemMove(element, x, y, r) {
        // var color = '';
        // var abs = Math.abs(x);
        // let min = Math.trunc(Math.min(16 * 16 - abs, 16 * 16));
        // let hexCode = this.decimalToHex(min, 2);

        // if (x > 0) {
        //   color = '#' + hexCode + 'FF' + hexCode;
        // } else {
        //   color = '#FF' + hexCode + hexCode;
        // }

        // temporarly disabled
        // element.style.background = color;
        element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
    }


    voteUp(like: boolean) {
        let removedCard = this.cards.pop();
        // console.log('Removed: ', removedCard.title);
        if(this.cards.length === 0) {
            this.addNewCards();
        }
        // if (like) {
        //   console.log('You liked: ');
        // } else {
        //   console.log('You disliked: ');
        // }
    }


    addNewCards() {
        // console.log("WAITING FOR NEW CARDS...");

        this.api.getPolas().then((data)=>{
            this.cards = data;
            if(this.cards.length === 0) {
                this.presentError('Pas de pola pour cette request');
                this.dismissLoading();
            }
            else {
                this.switchStyle();
                this.dismissLoading();
            }
        }).catch((error)=>{
            this.presentError(error.toString());
            this.dismissLoading();
        });

        if(typeof this.cards === 'undefined' || this.cards.length === 0) {
            this.presentLoading();
        }
    }

    switchStyle() {
        if(this.stackStyle === 'stack-style-1') {
            this.stackStyle = 'stack-style-2';
        }
        else {
            this.stackStyle = 'stack-style-1';
        }
    }
    // http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript
    // decimalToHex(d, padding) {
    //   var hex = Number(d).toString(16);
    //   padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
    //   while (hex.length < padding) {
    //     hex = "0" + hex;
    //   }
    //   return hex;
    // }

    presentLoading() {
        this.loader = this.loadingCtrl.create({
            spinner: 'dots',
            content: this.vars.getRandomMessagePosts()
        });
        this.loader.present();
    }

    ionViewWillLeave() {
        this.dismissLoading();
    }

    onShareClick() {
        console.log('PolaPage.onShareClick');
        const options = {
            message: this.cards[this.cards.length-1].title,
            subject: 'Le pola du ' + this.cards[this.cards.length-1].date.toString() + ' sur Faubourg Simone', // fi. for email
            files: [], // an array of filenames either locally or remotely
            url: this.cards[this.cards.length-1].permalink,
            chooserTitle: 'Choisis une application' // Android only, you can override the default share sheet title
        };
        this.socialSharing.shareWithOptions( options ).then(() => {
            console.log("Shared !")
        }).catch(() => {
            console.log("Not Shared !")
        });
    }

    dismissLoading() {
        if(this.loader) {
            this.loader.dismiss();
        }
    }

    presentError(message) {
        let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: message,
            buttons: ['Moki Doki!']
        });
        alert.present();
    }
}