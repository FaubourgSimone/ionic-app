import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { GlobalService } from "./global-service";

@Injectable()
export class PolaService {

  private requestCount:number = 10;
  private currentQueryPage:number;
  private totalQueryPage:number;

  constructor(public http: Http, private vars:GlobalService) {
    console.log('Hello PolaService Provider');
  }
  getPolas() {
    console.log('PolaService.getCalepins');
    // if (this.calepins) {
    //   return Promise.resolve(this.calepins);
    // }

    return new Promise((resolve, reject) => {
      let url = this.vars.URL_POLAS.baseUrl + this.vars.URL_POLAS.params.count + this.requestCount;
      if(typeof this.currentQueryPage !== 'undefined') {
        // TODO verifier qu'on atteint pas le nombre total de pages
        this.currentQueryPage++;
        url = url + this.vars.URL_POLAS.params.page + this.currentQueryPage;
      }

      this.http.get(url)
          .map(data => data.json())
          .subscribe(result => {
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

                      return {
                        id: post.id,
                        title: post.title,
                        image: img,
                        date: new Date(post.date)
                      };
                    })
                    .filter(post=>{
                      return (post.image !== null);
                    })
                    .reverse();

                let postsArray = [];
                for (let post of posts) {
                  postsArray.push(post);
                }
                resolve(postsArray);
              },
              error => {
                reject(new Error(error.toString()));
              });
    });
  }
}
