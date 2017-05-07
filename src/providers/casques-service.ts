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
                            // Escape HTML content
                            const el:HTMLElement = document.createElement('textarea');
                            el.innerHTML = '"' + post.title + ' - ' + post.custom_fields.dlc_artist + '" sur Faubourg Simone (@FaubourgSimone)';
                            const shareOptions = {
                                message: el.innerHTML,
                                subject: post.title + ' sur Faubourg Simone',
                                url: post.url
                            };
                            return {
                                id: post.id,
                                title: post.title,
                                artist: post.custom_fields.dlc_artist,
                                buyLink: post.custom_fields.dlc_buy_link || null,
                                preview: post.custom_fields.dlc_preview_link || null,
                                thumbnail: post.thumbnail_images.medium.url || post.thumbnail,
                                excerpt: post.excerpt.replace(/\(lire la suite\)/g,' '),
                                date: new Date(post.date),
                                permalink: post.url,
                                shareOptions: shareOptions
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
                        // Escape HTML content
                        const el:HTMLElement = document.createElement('textarea');
                        el.innerHTML = '"' + data.title.rendered + ' - ' + data.acf.dlc_artist + '" sur Faubourg Simone (@FaubourgSimone)';
                        const shareOptions = {
                            message: data.title.rendered,
                            subject: data.title.rendered + ' sur Faubourg Simone',
                            url: data.link
                        };
                        const result = {
                            title:    data.title.rendered,
                            artist: data.acf.dlc_artist,
                            buyLink: data.acf.dlc_buy_link || null,
                            preview: data.acf.dlc_preview_link || null,
                            video: data.acf.dlc_video || null,
                            content: data.content.rendered,
                            date: new Date(data.date),
                            permalink: data.link,
                            shareOptions: shareOptions
                        };

                        // console.log(result);
                        resolve(result);
                    },
                    error => {
                        reject(new Error(error.toString()));
                    }
                );
        });
    }

}
