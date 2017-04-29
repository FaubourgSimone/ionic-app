import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { GlobalService } from "./global-service";


/*
 Generated class for the CalepinsService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class CalepinsService {

  private calepins:any;
  private requestCount:number = 10;
  private requestCurrentPage:number;
  private totalPages:number;

  constructor(public http: Http, private vars:GlobalService) {
    console.log('Hello CalepinsService Provider');
    // this.calepins = null;
  }

  getCalepins() {
    console.log('CalepinsService.getCalepins');
    if (this.calepins) {
      return Promise.resolve(this.calepins);
    }

    return new Promise((resolve, reject) => {
      let url = this.vars.URL_CALEPINS.baseUrl + this.vars.URL_CALEPINS.params.count + this.requestCount;

      if(typeof this.requestCurrentPage !== 'undefined') {
        // TODO verifier qu'on atteint pas le nombre total de pages
        this.requestCurrentPage++;
        url = url + this.vars.URL_CALEPINS.params.page + this.requestCurrentPage;
      }

      this.http.get(url)
          .map(res => res.json())
          .subscribe(
              data => {
                // c'est la premiere fois que la requete a lieu on ne sait pas quelle est la page et le nombre total de page
                if(typeof this.requestCurrentPage === 'undefined') {
                  this.totalPages = parseInt(data.pages, 10);
                  this.requestCurrentPage = 1;
                }
                let calepins = data.posts.map((post)=> {
                  return {
                    id: post.id,
                    title: post.title,
                    subtitle: post.custom_fields.cal_subtitle,
                    thumbnail: post.thumbnail
                  }
                });
                resolve(calepins);
              },
              error => {
                // TODO AFFICHER UN MESSAGE D'ERREUR
                reject(new Error(error.toString()));
              }
          );
    });
  }

}
