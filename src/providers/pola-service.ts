import 'rxjs/add/operator/map';
import { Injectable }       from '@angular/core';
import { Http }             from '@angular/http';
import { GlobalService }    from "./global-service";
import { DatePipe }         from "@angular/common";
import {TranslateService}   from "ng2-translate";

@Injectable()
export class PolaService {

    private requestCount:number = 5;
    private currentQueryPage:number;
    private totalQueryPage:number;
    private datePipe:DatePipe;
    private limitAllowed:number = 20;

    constructor(public http: Http, private vars:GlobalService, private translateService: TranslateService) {
        console.log('Hello PolaService Provider');
        this.datePipe = new DatePipe('fr-FR');
    }
    getPolas() {
        console.log("################# GETPOLAS");
        return new Promise((resolve, reject) => {
            let url = this.vars.URL_POLAS.baseUrl + this.vars.URL_POLAS.params.count + this.requestCount;
            if(typeof this.currentQueryPage !== 'undefined') {

                this.currentQueryPage++;
                // Check if allowed limit is reached
                if(this.currentQueryPage > this.limitAllowed / this.requestCount) {
                    // TODO : inform user that we are looping to the beginning
                    this.currentQueryPage = 1;
                }

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
                                return {
                                    id: post.id,
                                    title: post.title,
                                    image: img,
                                    date: new Date(post.date.replace(' ', 'T')),
                                    permalink: post.url,
                                    shareOptions: null,
                                    trackingOptions: null
                                };
                            })
                            .filter(post=>{
                                return (post.image !== null);
                            })
                            .reverse();

                        let postsArray = [];
                        let i=0;
                        for (let post of posts) {
                            let shareOptions = {
                                message: '',
                                subject: '',
                                url: ''
                            };
                            this.translateService
                                .get('SHARING.POLA.MESSAGE', {title: post.title})
                                .flatMap((result: string) => {
                                    shareOptions.message = result;
                                    return this.translateService.get('SHARING.POLA.SUBJECT', {date: this.datePipe.transform(new Date(post.date), 'dd/MM/yyyy').toString()})
                                })
                                .flatMap((result: string) => {
                                    shareOptions.subject = result;
                                    return this.translateService.get('SHARING.POLA.URL', {url: post.permalink})
                                })
                                .subscribe((result: string) => {
                                    shareOptions.url = result;
                                    post.shareOptions = shareOptions;

                                    let trackingOptions = {
                                        category: '',
                                        action: '',
                                        label: ''
                                    };

                                    this.translateService
                                        .get('TRACKING.SHARE.POLA.CATEGORY')
                                        .flatMap((result: string) => {
                                            trackingOptions.category = result;
                                            return this.translateService.get('TRACKING.SHARE.POLA.ACTION')
                                        })
                                        .flatMap((result: string) => {
                                            trackingOptions.action = result;
                                            return this.translateService.get('TRACKING.SHARE.POLA.LABEL', {link: post.permalink} )
                                        })
                                        .subscribe((result: string) => {
                                            trackingOptions.label = result;
                                            post.trackingOptions = trackingOptions;

                                            postsArray.push(post);
                                            i++;

                                            if( i === posts.length ) {
                                                console.log('resolve ', posts);
                                                resolve(postsArray);
                                            }
                                        });

                                });

                        }
                    },
                    error => {
                        console.log('error');
                        reject(new Error(error.toString()));
                    });
        });
    }
}
