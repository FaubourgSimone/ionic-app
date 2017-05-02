import {Injectable} from '@angular/core';

@Injectable()
export class GlobalService {

    public DEVMODE:boolean = true;

    public  BASE_URL:string;
    public  URL_INFO:string;

    private BASE_URL_API_PROD:string    = 'http://faubourgsimone.paris';
    private BASE_URL_API_DEV:string     = 'http://faubourgsimone.local';
    public  URL_INFO_PROD:string        = 'http://faubourgsimone.paris/ionic-app/info.json';
    public  URL_INFO_DEV:string         = 'http://fbrgsmn.proustib.at/ionic-app/info.json';

    public URL_STREAMING_DEFAULT        = 'http://91.121.65.131:1337/faubourgsimone';
    public URL_COVERS_API               = 'http://ks25555.kimsufi.com/fsapi/cacheapi.json';

    public URL_POLAS:       { baseUrl:string, params: { count:string, page:string } };
    public URL_CALEPINS:    { baseUrl:string, params: { count:string, page:string } };
    public URL_CASQUES:     { baseUrl:string, params: { count:string, page:string } };
    public URL_CALEPIN:string;
    public URL_CASQUE:string;
    public URL_CASQUE_FIELDS:string;

    public loadingMsgPosts:Array<string> = [
        "Tout doux beau prince !",
        "Patience beauté !",
        "Quelques secondes minouche !",
        "Effeuillage imminent",
        "On prépare les magrets",
        "On vous beurre les tartines"
    ];

    public loadingMsgRadio:Array<string> = [
        "Paris ne s'est pas faite en un jour !",
        "En voiture Simone !",
        "Préparation du café !",
        "Préchauffage du transistor !",
        "Mixage du son et de l'avoine en cours !",
        "Déploiement de l'antenne !",
        "On cherche la prise Jack !",
        "On vous envoie la sauce !"
    ];

    constructor() {
        console.log('Hello GlobalService Provider');
        if(!this.DEVMODE) {
            this.BASE_URL = this.BASE_URL_API_PROD;
            this.URL_INFO =  this.URL_INFO_PROD;
        }
        else {
            this.BASE_URL = this.BASE_URL_API_DEV;
            this.URL_INFO =  this.URL_INFO_DEV;
        }

        this.URL_POLAS = {
            baseUrl: this.BASE_URL + '/api/get_posts/?post_type=pola' ,
            params: {
                count: '&count=',
                page: '&page='
            }
        };

        this.URL_CALEPINS = {
            baseUrl: this.BASE_URL + '/api/get_posts/?post_type=calepin' ,
            params: {
                count: '&count=',
                page: '&page='
            }
        };

        this.URL_CALEPIN = this.BASE_URL + '/wp-json/wp/v2/calepin/'; // + {id}

        this.URL_CASQUES = {
            baseUrl: this.BASE_URL + '/api/get_recent_posts/?post_type=nouveaute' ,
            params: {
                count: '&count=',
                page: '&page='
            }
        };

        this.URL_CASQUE = this.BASE_URL + '/wp-json/wp/v2/nouveaute/'; // + {id}
        this.URL_CASQUE_FIELDS = this.BASE_URL + '/wp-json/acf/v2/nouveaute/'; // + {id}
    }

    getRandomMessageRadio() {
        return this.loadingMsgRadio[Math.floor(Math.random() * (this.loadingMsgRadio.length-1))];
    }

    getRandomMessagePosts() {
        return this.loadingMsgPosts[Math.floor(Math.random() * (this.loadingMsgPosts.length-1))];
    }
}