import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { GlobalService } from "./global-service";


@Injectable()
export class CasquesService {

    private requestCount:number = 10;
    private requestCurrentPage:number;
    private totalPages:number;

    constructor(public http: Http, private vars:GlobalService) {
        console.log('Hello CasquesService Provider');
    }

    getCasques() {
        console.log('CasquesService.getCasques');
        return new Promise((resolve, reject) => {
            let url = this.vars.URL_CASQUES.baseUrl + this.vars.URL_CASQUES.params.count + this.requestCount;

            if(typeof this.requestCurrentPage !== 'undefined') {
                // TODO verifier qu'on atteint pas le nombre total de pages
                this.requestCurrentPage++;
                url = url + this.vars.URL_CASQUES.params.page + this.requestCurrentPage;
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
                        const casques = data.posts.map((post)=> {
                            console.log(post);
                            return {
                                id: post.id,
                                title: post.title,
                                artist: post.custom_fields.dlc_artist,
                                thumbnail: post.thumbnail_images.medium.url || post.thumbnail,
                                excerpt: post.excerpt.replace(/\(lire la suite\)/g,' '),
                                date: new Date(post.date)
                            };
                        });
                        resolve(casques);
                    },
                    error => {
                        reject(new Error(error.toString()));
                    }
                );
        });
    }

    getCasque(postId:string) {
        console.log('CasquesService.getCasque: ', postId);

        return new Promise((resolve, reject) => {
            const url = this.vars.URL_CASQUE + postId;

            this.http.get(url)
                .map(res => res.json())
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    error => {
                        reject(new Error(error.toString()));
                    }
                );
        });
    }

}
