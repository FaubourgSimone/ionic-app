import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { GlobalService } from "./global-service";


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
        // if (this.calepins) {
        //     return Promise.resolve(this.calepins);
        // }

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
                                date: new Date(post.date)
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
        console.log('CalepinService.getCalepin: ', postId);

        return new Promise((resolve, reject) => {
            const url = this.vars.URL_CALEPIN + postId;

            console.log(url);
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
                        // content = decodeURIComponent(content);
                        const calepin = {
                            title:    data.title.rendered,
                            subtitle: data.acf.cal_subtitle,
                            content: content,
                            date: new Date(data.date),
                            permalink: data.link
                        };
                        resolve(calepin);
                    },
                    error => {
                        reject(new Error(error.toString()));
                    }
                );
        });
    }

}
