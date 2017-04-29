import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { GlobalService } from '../providers/global-service';


@Injectable()
export class InitService {

  constructor(public http: Http, private vars:GlobalService) {}

  getInitData() {
    return this.http
        .get(this.vars.URL_INFO)
        .map(res => {
          // If request fails, throw an Error that will be caught
          if(res.status < 200 || res.status >= 300) {
            return new Error('This request has failed ' + res.status);
          }
          // If everything went fine, return the response
          else {
            return res.json();
          }
        });
  }
}
