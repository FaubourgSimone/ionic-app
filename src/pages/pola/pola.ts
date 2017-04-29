import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import { GlobalService } from '../../providers/global-service';

import {
  StackConfig,
  DragEvent,
  SwingStackComponent,
  SwingCardComponent
} from 'angular2-swing';

@Component({
  selector: 'page-pola',
  templateUrl: 'pola.html',
  providers: []
})
export class PolaPage {
  @ViewChild('myswing1') swingStack: SwingStackComponent;
  @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;

  cards: Array<any> = [];
  stackConfig: StackConfig;
  recentCard: string = '';
  currentQueryPage:number;
  totalQueryPage:number;
  polaGapForRequest:number = 10;
  stackStyle:string = 'stack-style-1';
  private loader:Loading;

  constructor(public navCtrl: NavController,
              private http: Http,
              private vars:GlobalService,
              private loadingCtrl: LoadingController) {

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

  ngOnInit() {
    // Either subscribe in controller or set in HTML
    this.swingStack.throwin.subscribe((event: DragEvent) => {
      event.target.style.background = '#ffffff';
    });

    this.addNewCards(this.polaGapForRequest);
  }

  // Called whenever we drag an element
  // Change background color depending on left or right movement
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

  // Connected through HTML
  voteUp(like: boolean) {
    let removedCard = this.cards.pop();
    // console.log('Removed: ', removedCard.title);
    if(this.cards.length === 0) {
      this.addNewCards(this.polaGapForRequest);
    }
    // if (like) {
    //   console.log('You liked: ');
    // } else {
    //   console.log('You disliked: ');
    // }
  }

  // Add new cards to our array
  addNewCards(count: number) {
    // console.log("WAITING FOR NEW CARDS...");
    this.presentLoading();
    let url = this.vars.URL_POLAS.baseUrl + this.vars.URL_POLAS.params.count + count;
    if(typeof this.currentQueryPage !== 'undefined') {
      // TODO verifier qu'on atteint pas le nombre total de pages
      this.currentQueryPage++;
      url = url + this.vars.URL_POLAS.params.page + this.currentQueryPage;
    }

    this.http.get(url)
      .map(data => data.json())
      .subscribe(result => {
        // let posts = result.posts;

        // c'est la premiere fois que la requete a lieu
        // on ne sait pas quelle est la page et le nombre total de page
        if(typeof this.currentQueryPage === 'undefined') {
          this.totalQueryPage = parseInt(result.pages, 10);
          this.currentQueryPage = 1;
        }

        let posts = result.posts
            .map(post => {
              let img = null;
              if( post.custom_fields
                  && post.custom_fields.pola_picture
                  && post.custom_fields.pola_picture.sizes
                  && post.custom_fields.pola_picture.sizes.medium) {
                  img = post.custom_fields.pola_picture.sizes.medium;
              }

              // TODO sortir ca d'ici et utiliser moment js ?
              let formatDate = (date)=>{
                let monthNames = [
                  "Janvier", "Février", "Mars",
                  "Avril", "Mai", "Juin", "Juillet",
                  "Aout", "Septembre", "Octobre",
                  "Novembre", "Décembre"
                ];

                let day = date.getDate();
                let monthIndex = date.getMonth();
                let year = date.getFullYear();

                return day + ' ' + monthNames[monthIndex] + ' ' + year;
              };

              return {
                id: post.id,
                title: post.title,
                image: img,
                date: formatDate(new Date(post.date))
              };
            })
            .filter(post=>{
              return (post.image !== null);
            })
            .reverse();

        for (let val of posts) {
          this.cards.push(val);
        }

        if(posts.length === 0) {
          this.addNewCards(5);
        }
        else {
          // console.log('GOT NEW CARDS');
            this.switchStyle();
            this.dismissLoading();
        }

      },
      err=>{
        // TODO AFFICHER UN MESSAGE D'ERREUR
        alert('Verifier votre connexion à internet');
        this.dismissLoading();
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
    let message = 'Recherche les polas précédents';
    if(typeof this.currentQueryPage === 'undefined') {
      // premiere fois que le loader s'affiche
      message = 'Recherche les polas du jour';
    }

    this.loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: message
    });
    this.loader.present();
  }

  dismissLoading() {
    if(this.loader) {
      this.loader.dismiss();
    }
  }


}