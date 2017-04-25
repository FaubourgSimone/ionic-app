import {Injectable} from '@angular/core';

@Injectable()
export class GlobalVars {

    public DEVMODE = false;



    public URL_INFO = 'http://faubourgsimone.paris/ionic-app/info.json';


    public URL_POLA = {
        baseUrl: 'http://faubourgsimone.paris/api/get_recent_posts/?post_type=pola' ,
        params: {
            count: '&count=',
            page: '&page='
        }
    };

    public URL_STREAMING_DEFAULT = 'http://91.121.65.131:1337/faubourgsimone';
    public URL_COVERS_API = 'http://ks25555.kimsufi.com/fsapi/cacheapi.json';

    constructor() {
        if(this.DEVMODE) {
            this.URL_POLA.baseUrl = 'http://faubourgsimone.local/api/get_recent_posts/?post_type=pola';
            this.URL_INFO = 'http://fbrgsmn.proustib.at/ionic-app/info.json';
        }
    }
}