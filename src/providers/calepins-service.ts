import 'rxjs/add/operator/map';
import { Injectable }       from '@angular/core';
import { Http }             from '@angular/http';
import { GlobalService }    from "./global-service";
import { TranslateService } from "ng2-translate";


@Injectable()
export class CalepinsService {

    private requestCount = 10;
    private requestCurrentPage:number;
    private totalPages:number;

    constructor(public http: Http, private vars:GlobalService, private translateService: TranslateService) {
        console.log('Hello CalepinsService Provider');
    }

    getCalepins() {
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
                        const calepins = data.posts.map((post)=> {
                            return {
                                id: post.id,
                                title: post.title,
                                subtitle: post.custom_fields.cal_subtitle,
                                thumbnail: post.thumbnail,
                                date: new Date(post.date.replace(' ', 'T'))
                            }
                        });
                        resolve(calepins);
                    },
                    error => {
                        reject(new Error(error.toString()));
                    }
                );
        });
    }

    getCalepin(postId:string) {
        return new Promise((resolve, reject) => {
            const url = this.vars.URL_CALEPIN + postId;
            this.http.get(url)
                .map(res => res.json())
                .subscribe(
                    data => {
                        // TODO : WTF trouver une regex
                        let content = data.content.rendered
                            .replace(/<p>\&nbsp;<\/p>/g,' ')
                            .replace(/<p style="text-align: center;"><strong>_________________________________________________________________________<\/strong><\/p>/g,'<hr>')
                            .replace(/<p><strong>_________________________________________________________________________<\/strong><\/p>/g,'<hr>')
                            .replace(/<p style="text-align: center;"><strong>________________________________________________________________<\/strong><\/p>/g,'<hr>')
                            .replace(/<p><strong>________________________________________________________________<\/strong><\/p>/g,'<hr>')
                            .replace(/<strong>________________________________________________________________<\/strong>/g,'<hr>')
                            .replace(/<strong> ________________________________________________________________<\/strong>/g,'<hr>')
                            .replace(/<p><\/p>/g,' ')
                            .replace(/<p style="text-align: center;><\/p>/g,' ')
                            .replace(/<hr><br \/>/g,'<hr>')
                            .replace(/<p style="text-align: center;"><hr>/g,'<hr><p>')
                            .replace(/<hr><\/p>/g,'<\/p><hr>');


                        this.translateService
                            .get('SHARING.ON_FBRG_SMN')
                            .subscribe((result: string) => {

                                // Escape HTML content
                                const el:HTMLElement = document.createElement('textarea');
                                el.innerHTML = `${data.title.rendered} - ${data.acf.cal_subtitle} ${result} (@FaubourgSimone)`;
                                const shareOptions = {
                                    message: el.innerHTML,
                                    subject: `${data.title.rendered} ${result}`,
                                    url: data.link
                                };

                                const trackingOptions = {
                                    category: '',
                                    action: '',
                                    label: ''
                                };

                                this.translateService
                                    .get('TRACKING.SHARE.CALEPIN.CATEGORY')
                                    .flatMap((result: string) => {
                                        trackingOptions.category = result;
                                        return this.translateService.get('TRACKING.SHARE.CALEPIN.ACTION')
                                    })
                                    .flatMap((result: string) => {
                                        trackingOptions.action = result;
                                        return this.translateService.get('TRACKING.SHARE.CALEPIN.LABEL', {link: data.link} )
                                    })
                                    .subscribe((result: string) => {
                                        trackingOptions.label = result;

                                        const calepin = {
                                            title:    data.title.rendered,
                                            subtitle: data.acf.cal_subtitle,
                                            content,
                                            date: new Date(data.date),
                                            permalink: data.link,
                                            shareOptions,
                                            trackingOptions
                                        };

                                        resolve(calepin);
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
