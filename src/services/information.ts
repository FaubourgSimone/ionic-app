import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

export class InformationService {
    static get parameters() {
        return [[Http]];
    }

    constructor(private http:Http) {

    }

    getInitData() {
        console.log('InformationService.getInitData');
        return this.http
            .get('http://fbrgsmn.proustib.at/ionic-app/info.json')
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

    getCurrentSongs() {
        return this.http
            .get('http://ks25555.kimsufi.com/fsapi/cacheapi.json')
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