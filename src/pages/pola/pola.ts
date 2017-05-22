import { ViewController, Platform, NavController } from 'ionic-angular';
import { Component }                from '@angular/core';
import { GoogleAnalytics }          from "@ionic-native/google-analytics";
import { StackConfig  }             from 'angular2-swing';
import { PolaService }              from "../../providers/pola-service";
import { PromptService }            from "../../providers/prompt-service";
import {TranslateService} from "ng2-translate";

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

    constructor(public navCtrl: NavController,
                private viewCtrl: ViewController,
                private api: PolaService,
                private ga: GoogleAnalytics,
                private plt: Platform,
                private prompt: PromptService,
                private translateService:TranslateService) {

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

        let trackingCategory, trackingAction, trackingLabel;
        this.translateService
            .get('TRACKING.POLA.CATEGORY')
            .flatMap((result: string) => {
                trackingCategory = result;
                return this.translateService.get('TRACKING.POLA.ACTION.SWIPE')
            })
            .flatMap((result: string) => {
                trackingAction = result;
                return this.translateService.get('TRACKING.POLA.LABEL.SWIPE', {index: this.displayedCardNb.toString()})
            })
            .subscribe((result: string) => {
                trackingLabel = result;
                console.log(trackingCategory, trackingAction, trackingLabel);
                this.ga.trackEvent(trackingCategory, trackingAction, trackingLabel);
            });

        let voteFor, voteAgainst;
        this.translateService
            .get('POLAPAGE.FOR')
            .flatMap((result: string) => {
                voteFor = result;
                return this.translateService.get('POLAPAGE.AGAINST')
            })
            .subscribe((result: string) => {
                voteAgainst = result;
                const verb = like ? voteFor : voteAgainst;
                this.prompt.presentMessage({message: `Tu as vote ${verb} ${removedCard.title}`, duration: 3000, classNameCss: 'vote-pola'});

                let trackingCategoryVote, trackingActionVote, trackingLabelVote;
                this.translateService
                    .get('TRACKING.POLA.CATEGORY')
                    .flatMap((result: string) => {
                        trackingCategory = result;
                        return this.translateService.get('TRACKING.POLA.ACTION.VOTE', {verb: verb})
                    })
                    .flatMap((result: string) => {
                        trackingAction = result;
                        return this.translateService.get('TRACKING.POLA.LABEL.VOTE', {removedCardId: removedCard.id})
                    })
                    .subscribe((result: string) => {
                        trackingLabel = result;
                        console.log(trackingCategory, trackingAction, trackingLabel);
                        this.ga.trackEvent(trackingCategoryVote, trackingActionVote, trackingLabelVote);
                    });

            });

        if(this.cards.length === 0) {
            this.refillNb++;

            let trackingCategory, trackingAction, trackingLabel;
            this.translateService
                .get('TRACKING.POLA.CATEGORY')
                .flatMap((result: string) => {
                    trackingCategory = result;
                    return this.translateService.get('TRACKING.POLA.ACTION.REFILL')
                })
                .flatMap((result: string) => {
                    trackingAction = result;
                    return this.translateService.get('TRACKING.POLA.LABEL.REFILL', {time: this.refillNb.toString()})
                })
                .subscribe((result: string) => {
                    trackingLabel = result;
                    console.log(trackingCategory, trackingAction, trackingLabel);
                    this.ga.trackEvent(trackingCategory, trackingAction, trackingLabel);
                });

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