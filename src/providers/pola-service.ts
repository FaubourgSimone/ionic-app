import 'rxjs/add/operator/map';
import { Injectable }       from '@angular/core';
import { Http }             from '@angular/http';
import { GlobalService }    from "./global-service";
import { DatePipe }         from "@angular/common";

@Injectable()
export class PolaService {

    private requestCount:number = 7;
    private currentQueryPage:number;
    private totalQueryPage:number;
    private datePipe:DatePipe;

    constructor(public http: Http, private vars:GlobalService) {
        console.log('Hello PolaService Provider');
        this.datePipe = new DatePipe('fr-FR');
    }
    getPolas() {
        return new Promise((resolve, reject) => {
            let url = this.vars.URL_POLAS.baseUrl + this.vars.URL_POLAS.params.count + this.requestCount;
            if(typeof this.currentQueryPage !== 'undefined') {
                // TODO verifier qu'on atteint pas le nombre total de pages
                this.currentQueryPage++;
                url = url + this.vars.URL_POLAS.params.page + this.currentQueryPage;
            }

            this.http.get(url)
                .map(data => data.json())
                // .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
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
                                const shareOptions = {
                                    message: post.title,
                                    subject: 'Le pola du ' + this.datePipe.transform(new Date(post.date), 'dd/MM/yyyy').toString() + ' sur Faubourg Simone',
                                    url: post.url
                                };
                                return {
                                    id: post.id,
                                    title: post.title,
                                    image: img,
                                    date: new Date(post.date),
                                    permalink: post.url,
                                    shareOptions: shareOptions
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
                    console.log('error');
                        reject(new Error(error.toString()));
                    });
        });
    }
}
