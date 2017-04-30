import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { GlobalService } from '../providers/global-service';


@Injectable()
export class InitService {

  constructor(public http: Http, private vars:GlobalService) {}

  getInitData() {


      return new Promise((resolve, reject) => {

          this.http.get(this.vars.URL_INFO)
              .map(res => res.json())
              .subscribe(
                  data => resolve(data),
                  error =>reject('Erreur lors du chargement de ' + this.vars.URL_INFO + ': ' + error)
              );
      });
  }
}
