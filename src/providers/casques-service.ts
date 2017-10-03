import 'rxjs/add/operator/map';
import { Injectable }       from '@angular/core';
import { Http }             from '@angular/http';
import { GlobalService }    from "./global-service";
import { TranslateService } from "ng2-translate";


@Injectable()
export class CasquesService {

    private requestCount:number = 10;
    private requestCurrentPage:number;
    private totalPages:number;

    constructor(public http: Http, private vars:GlobalService, private translateService: TranslateService) {
        console.log('Hello CasquesService Provider');
    }

    getCasques() {
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


                        this.translateService
                            .get('SHARING.ON_FBRG_SMN')
                            .subscribe((result: string) => {
                                let casquesArray = [];
                                data.posts.map((post)=> {

                                    // Escape HTML content
                                    const el:HTMLElement = document.createElement('textarea');
                                    el.innerHTML = '"' + post.title + ' - ' + post.custom_fields.dlc_artist + ' ' + result +'" (@FaubourgSimone)';
                                    const shareOptions = {
                                        message: el.innerHTML,
                                        subject: post.title + ' ' + result,
                                        url: post.url
                                    };

                                    const trackingOptions = {
                                        category: '',
                                        action: '',
                                        label: ''
                                    };

                                    this.translateService
                                        .get('TRACKING.SHARE.CASQUE.CATEGORY')
                                        .flatMap((result: string) => {
                                            trackingOptions.category = result;
                                            return this.translateService.get('TRACKING.SHARE.CASQUE.ACTION')
                                        })
                                        .flatMap((result: string) => {
                                            trackingOptions.action = result;
                                            return this.translateService.get('TRACKING.SHARE.CASQUE.LABEL', {link: post.url} )
                                        })
                                        .subscribe((result: string) => {
                                            trackingOptions.label = result;

                                            casquesArray.push({
                                                id: post.id,
                                                title: post.title,
                                                artist: post.custom_fields.dlc_artist,
                                                buyLink: post.custom_fields.dlc_buy_link || null,
                                                preview: post.custom_fields.dlc_preview_link || null,
                                                thumbnail: post.thumbnail_images.medium.url || post.thumbnail,
                                                excerpt: post.excerpt.replace(/\(lire la suite\)/g,' '),
                                                date: new Date(post.date.replace(' ', 'T')),
                                                permalink: post.url,
                                                shareOptions: shareOptions,
                                                trackingOptions: trackingOptions
                                            });

                                            if(casquesArray.length === data.posts.length) {
                                                resolve(casquesArray);
                                            }
                                        });
                                });
                            });
                    },
                    error => {
                        reject(new Error(error.toString()));
                    }
                );
        });
    }

    getCasque(postId:string) {
        return new Promise((resolve, reject) => {
            const url = this.vars.URL_CASQUE + postId;

            this.http.get(url)
                .map(res => res.json())
                .subscribe(
                    data => {

                        this.translateService
                            .get('SHARING.ON_FBRG_SMN')
                            .subscribe((onFbrg: string) => {
                                // Escape HTML content
                                const el:HTMLElement = document.createElement('textarea');
                                el.innerHTML = '"' + data.title.rendered + ' - ' + data.acf.dlc_artist + ' ' + onFbrg + '" (@FaubourgSimone)';
                                const shareOptions = {
                                    message: el.innerHTML,
                                    subject: el.innerHTML + ' ' + onFbrg,
                                    url: data.link
                                };
                                const trackingOptions = {
                                    category: '',
                                    action: '',
                                    label: ''
                                };

                                this.translateService
                                    .get('TRACKING.SHARE.CASQUE.CATEGORY')
                                    .flatMap((cat: string) => {
                                        trackingOptions.category = cat;
                                        return this.translateService.get('TRACKING.SHARE.CASQUE.ACTION')
                                    })
                                    .flatMap((act: string) => {
                                        trackingOptions.action = act;
                                        return this.translateService.get('TRACKING.SHARE.CASQUE.LABEL', {link: data.link} )
                                    })
                                    .subscribe((lab: string) => {
                                        trackingOptions.label = lab;
                                        const result = {
                                            title:    data.title.rendered,
                                            artist: data.acf.dlc_artist,
                                            buyLink: data.acf.dlc_buy_link || null,
                                            preview: data.acf.dlc_preview_link || null,
                                            video: data.acf.dlc_video || null,
                                            content: data.content.rendered,
                                            date: new Date(data.date),
                                            permalink: data.link,
                                            shareOptions: shareOptions,
                                            trackingOptions: trackingOptions
                                        };
                                        resolve(result);
                                    });
                            });
                    },
                    error => {
                        reject(new Error(error.toString()));
                    }
                );
        });
    }

}
