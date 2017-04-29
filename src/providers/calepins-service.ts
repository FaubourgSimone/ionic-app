import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the CalepinsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CalepinsService {

  private calepins:any;

  constructor(public http: Http) {
    console.log('Hello CalepinsService Provider');
    this.calepins = null;
  }

  getCalepins() {
    console.log('CalepinsService.getCalepins');
    if (this.calepins) {
      return Promise.resolve(this.calepins);
    }

    return new Promise(resolve => {
      this.http.get('http://faubourgsimone.local/api/get_posts/?post_type=calepin')
          .map(res => res.json())
          .subscribe(data => {
            this.calepins = data;
            resolve(this.calepins);
          });
    });
  }

}
