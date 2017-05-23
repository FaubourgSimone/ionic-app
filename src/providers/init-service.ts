import 'rxjs/add/operator/map';
import { Injectable }       from '@angular/core';
import { Http }             from '@angular/http';
import { GlobalService }    from '../providers/global-service';
import * as localConfig     from '../assets/config.json';


@Injectable()
export class InitService {

  constructor(public http: Http, private vars:GlobalService) {}

  getInitData() {
      console.log('InitService.getInitData');

      if(this.vars.DEVMODE) {
          return new Promise((resolve) => resolve(localConfig));
      }
      else {
          return new Promise((resolve, reject) => {
              this.http.get(this.vars.URL_INFO_PROD)
                  .map(res => res.json())
                  .subscribe(
                      data => resolve(data),
                      error => resolve({error:'Error when loading ' + this.vars.URL_INFO_PROD + ': ' + error, content:localConfig})
                  );
          });
      }
  }
}
