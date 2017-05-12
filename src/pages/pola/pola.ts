import { ViewController, Platform } from 'ionic-angular';
import { Component }                from '@angular/core';
import { GoogleAnalytics }          from "@ionic-native/google-analytics";
import { StackConfig  }             from 'angular2-swing';
import { PolaService }              from "../../providers/pola-service";
import { PromptService }            from "../../providers/prompt-service";

@Component({
    selector: 'page-pola',
    templateUrl: 'pola.html',
    providers: [PolaService]
})
export class PolaPage {

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
                return Math.min((2 * Math.abs(offset) / (element.offsetWidth / 2)), 1);
            },
            transform: (element, x, y, r) => {
                element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
            }
        };
    }

    ionViewDidLoad() {
        this.addNewCards();
    }

    voteUp(like: boolean) {
        let removedCard = this.cards.pop();
        this.ga.trackEvent( 'Swiper un pola' ,'Naviguer dans les polas', 'pola-' + this.displayedCardNb.toString());
        const verb = like ? 'pour' : 'contre';
        this.prompt.presentMessage({message: `Tu as vote ${verb} ${removedCard.title}`, duration: 3000, classNameCss: 'vote-pola'});
        this.ga.trackEvent( verb ,'Voter sur un pola', 'pola-' + removedCard.id);
        if(this.cards.length === 0) {
            this.refillNb++;
            this.ga.trackEvent('Charger d\'autres polas', 'Naviguer dans les polas', 'refill-calepin-' + this.refillNb.toString());
            this.addNewCards();
        }
        this.displayedCardNb++;
    }

    addNewCards() {
        if(typeof this.cards === 'undefined' || this.cards.length === 0) {
            this.prompt.presentLoading();
        }
        this.api.getPolas().then((data)=>{
            this.cards = data;
            if(this.cards.length === 0) {
                this.prompt.presentMessage({message: 'Pas de polas pour cette request', classNameCss: 'error'});
                this.prompt.dismissLoading();
            }
            else {
                this.switchStyle();
                this.prompt.dismissLoading();
            }
        }).catch((error)=>{
            this.prompt.presentMessage({message: error.toString(), classNameCss: 'error'});
            this.prompt.dismissLoading();
        });
    }

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