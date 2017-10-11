import { ViewController, Platform, NavController, Content } from 'ionic-angular';
import { Component, QueryList, ViewChild, ViewChildren }    from '@angular/core';
import { GoogleAnalytics }          from "@ionic-native/google-analytics";
import { TranslateService }         from "ng2-translate";
import { StackConfig, SwingCardComponent, SwingStackComponent, Direction } from 'angular2-swing';
import { PolaService }              from "../../providers/pola-service";
import { PromptService }            from "../../providers/prompt-service";
import { TrackerService }           from "../../providers/tracker-service";

@Component({
    selector: 'page-pola',
    templateUrl: 'pola.html',
    providers: [PolaService]
})
export class PolaPage {

    cards: any;
    stackConfig: StackConfig;
    stackStyle = 'stack-style-1';
    private displayedCardNb = 0;
    private refillNb = 0;

    @ViewChild( 'myswing1' ) swingStack: SwingStackComponent;
    @ViewChildren( 'mycards1' ) swingCards: QueryList<SwingCardComponent>;
    @ViewChild(Content) content: Content;


    constructor(public navCtrl: NavController,
                private viewCtrl: ViewController,
                private api: PolaService,
                private ga: GoogleAnalytics,
                private plt: Platform,
                private prompt: PromptService,
                private translateService: TranslateService,
                private tracker: TrackerService) {

        this.plt.ready().then( readySource => {
            console.log('Platform ready from', readySource);
            this.ga.trackView( this.viewCtrl.name );
        });


        this.stackConfig = {
            // Default setting only allows UP, LEFT and RIGHT so you can override this as below
            allowedDirections: [ Direction.LEFT, Direction.RIGHT, Direction.UP, Direction.DOWN ],
            // Now need to send offsetX and offsetY with element instead of just offset
            throwOutConfidence: ( offsetX, offsetY, element ) => {
                return Math.min( Math.max( Math.abs( offsetX ) / ( element.offsetWidth / 2 ), Math.abs( offsetY ) / ( element.offsetHeight / 2 ) ), 1);
            },
            throwOutDistance: d => {
                return 800;
            }
        }
    }

    ionViewDidLoad() {
        this.addNewCards();
    }

    onThrowOut( event ) {
        console.log( 'Hook from the template', event );
        switch( event.throwDirection ) {
            case Direction.RIGHT:
            case Direction.UP:
                this.vote( false );
                break;
            case Direction.LEFT:
            case Direction.DOWN:
                this.vote( true );
                break;
        }
    }

    vote( like: boolean ) {
        console.log('vote up');
        let removedCard = this.cards.pop();

        this.tracker.trackEventWithI18n(
            {translate: 'TRACKING.POLA.CATEGORY'},
            {translate: 'TRACKING.POLA.ACTION.SWIPE'},
            {translate: 'TRACKING.POLA.LABEL.SWIPE', params: {index: this.displayedCardNb.toString()}}
        );

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
                // this.prompt.presentMessage({
                //     message: `Tu as vote ${verb} ${removedCard.title}`,
                //     duration: 3000,
                //     classNameCss: 'vote-pola'
                // });

                this.tracker.trackEventWithI18n(
                    {translate: 'TRACKING.POLA.CATEGORY'},
                    {translate: 'TRACKING.POLA.ACTION.VOTE', params: {verb: verb}},
                    {translate: 'TRACKING.POLA.LABEL.VOTE', params: {removedCardId: removedCard.id}}
                );

            });

        if ( this.cards.length === 0 ) {
            this.refillNb++;
            this.tracker.trackEventWithI18n(
                {translate: 'TRACKING.POLA.CATEGORY'},
                {translate: 'TRACKING.POLA.ACTION.REFILL'},
                {translate: 'TRACKING.POLA.LABEL.REFILL', params: { time: this.refillNb.toString() } }
            );
            this.addNewCards();
        }
        this.displayedCardNb++;
    }

    addNewCards() {
        console.log('addnewcard');
        if( typeof this.cards === 'undefined' || this.cards.length === 0 ) {
            this.prompt.presentLoading();
        }
        this.api.getPolas().then( data => {
            this.cards = data;
            if( this.cards.length === 0 ) {
                this.translateService
                    .get('ERRORS.NO_POLA')
                    .subscribe( ( result: string ) => {
                        this.prompt.presentMessage( { message: result, classNameCss: 'error' } );
                    });
                this.prompt.dismissLoading();
            }
            else {
                this.switchStyle();
                this.prompt.dismissLoading();
            }
        }).catch((error)=>{
            this.prompt.presentMessage( { message: error.toString(), classNameCss: 'error' } );
            this.prompt.dismissLoading();
        });
    }

    switchStyle() {
        if( this.stackStyle === 'stack-style-1' ) {
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
