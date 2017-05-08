import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ViewController, Platform } from 'ionic-angular';
import {
    StackConfig,
    DragEvent,
    SwingStackComponent,
    SwingCardComponent
} from 'angular2-swing';
import { PolaService } from "../../providers/pola-service";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { PromptService } from "../../providers/prompt-service";

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
    private displayedCardNb:number = 0;
    private refillNb:number = 0;

    constructor(private viewCtrl: ViewController,
                private api: PolaService,
                private ga: GoogleAnalytics,
                private plt: Platform,
                private prompt: PromptService) {

        this.plt.ready().then((readySource) => {
            console.log('Platform ready from', readySource);
            this.ga.trackView(this.viewCtrl.name);
        });

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
            this.refillNb++;
            this.ga.trackEvent('Charger d\'autres polas', 'Naviguer dans les polas', 'refill-calepin-' + this.refillNb.toString());
            this.addNewCards();
        }
        this.ga.trackEvent( 'Swiper un pola' ,'Naviguer dans les polas', 'pola-' + this.displayedCardNb.toString(),);
        // if (like) {
        //   console.log('You liked: ');
        // } else {
        //   console.log('You disliked: ');
        // }
        this.displayedCardNb++;
    }


    addNewCards() {
        this.api.getPolas().then((data)=>{
            this.cards = data;
            if(this.cards.length === 0) {
                this.prompt.presentError('Pas de polas pour cette request');
                this.prompt.dismissLoading();
            }
            else {
                this.switchStyle();
                this.prompt.dismissLoading();
            }
        }).catch((error)=>{
            this.prompt.presentError(error.toString());
            this.prompt.dismissLoading();
        });

        if(typeof this.cards === 'undefined' || this.cards.length === 0) {
            this.prompt.presentLoading();
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

    switchStyle() {
        if(this.stackStyle === 'stack-style-1') {
            this.stackStyle = 'stack-style-2';
        }
        else {
            this.stackStyle = 'stack-style-1';
        }
    }

    ionViewWillLeave() {
        this.prompt.dismissLoading();
    }
}