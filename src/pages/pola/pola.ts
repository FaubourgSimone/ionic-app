import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController, LoadingController, Loading, Platform, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import { GlobalService } from '../../providers/global-service';
import {
    StackConfig,
    DragEvent,
    SwingStackComponent,
    SwingCardComponent
} from 'angular2-swing';
import { PolaService } from "../../providers/pola-service";
import { CustomErrorHandler } from "../../components/custom-error-handler";

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
    recentCard: string = '';
    // currentQueryPage:number;
    totalQueryPage:number;
    stackStyle:string = 'stack-style-1';
    private loader:Loading;

    constructor(public viewCtrl: ViewController,
                public navCtrl: NavController,
                public plt: Platform,
                private http: Http,
                private vars:GlobalService,
                private loadingCtrl: LoadingController,
                private api:PolaService,
                private errorHandler:CustomErrorHandler) {

        // this.plt.ready().then((readySource) => {
        //     console.log('Platform ready from', readySource);
        //     // Platform now ready, execute any required native code
        //     this.plt.registerBackButtonAction(()=> {
        //         let nav = this.viewCtrl.getNav();
        //         // let activeView: ViewController = nav.getActiveChildNav();
        //         if(this.viewCtrl != null){
        //             if(nav.canGoBack()) {
        //                 nav.pop();
        //             }else if (typeof this.viewCtrl.instance.backButtonAction === 'function')
        //                 this.viewCtrl.instance.backButtonAction();
        //             else nav.parent.select(0); // goes to the first tab
        //         }
        //     })
        // });

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
                this.errorHandler.handleError(new Error('Pas de pola pour cette request'));
                this.dismissLoading();
            }
            else {
                this.switchStyle();
                this.dismissLoading();
            }
        }).catch((error)=>{
            this.errorHandler.handleError(error);
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

    dismissLoading() {
        if(this.loader) {
            this.loader.dismiss();
        }
    }
}