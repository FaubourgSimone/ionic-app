import {Injectable} from '@angular/core';

@Injectable()
export class GlobalService {

    public DEVMODE = false;

    public  BASE_URL:string;

    private BASE_URL_API_PROD    = 'http://faubourgsimone.paris';
    private BASE_URL_API_DEV     = 'http://faubourgsimone.local';
    public URL_INFO_PROD         = 'http://faubourgsimone.paris/ionic-app/info.json';
    public URL_STREAMING_DEFAULT        = 'http://91.121.65.131:8000/;';
    // public URL_STREAMING_DEFAULT         = 'http://91.121.65.131:1337/faubourgsimone';
    public URL_COVERS_API               = 'http://ks25555.kimsufi.com/fsapi/cacheapi.json';

    public URL_POLAS:       { baseUrl:string, params: { count:string, page:string } };
    public URL_CALEPINS:    { baseUrl:string, params: { count:string, page:string } };
    public URL_CASQUES:     { baseUrl:string, params: { count:string, page:string } };
    public URL_CALEPIN:string;
    public URL_CASQUE:string;
    public URL_CASQUE_FIELDS:string;

    public COVER_DEFAULT = {
        jpg: "assets/images/cover-default.jpg",
        svg: "assets/images/cover-default.svg"
    };

    public COVER_DEFAULT_FRIDAY_WEAR = {
        jpg: 'assets/images/cover-friday-wear.jpg',
        svg: 'assets/images/cover-friday-wear.svg'
    };

    public COVER_DEFAULT_NOUVEAUTE = {
        jpg: 'assets/images/cover-news.jpg',
        svg: 'assets/images/cover-news.svg'
    };

    public loadingMsgPosts:Array<string> = [
        "Tout doux beau prince !",
        "Patience beauté !",
        "Quelques secondes minouche !",
        "Effeuillage imminent.",
        "On prépare les magrets.",
        "On vous beurre les tartines.",
        "Bien attend qui parratend.",
        "Patience et longueur de temps font plus que force ni que rage.",
        "Prends patience, tu verras des miracles",
        "Qui va piano va sano",
        "Goutte à goutte on emplit la cuve.",
        "Patience est mère de toutes les vertus",
        "Oui, oui, un p’tit instant voulez-vous"
    ];

    public loadingMsgRadio:Array<string> = [
        "Paris ne s'est pas faite en un jour !",
        "En voiture Simone !",
        "Préparation du café !",
        "Préchauffage du transistor !",
        "Mixage du son et de l'avoine en cours !",
        "Déploiement de l'antenne !",
        "On cherche la prise Jack !",
        "On vous envoie la sauce !",
        "Propagation des ondes",
        "Recherche de la ionosphere",
        "Oui, oui, un p’tit instant voulez-vous",
        "Patience est mère de toutes les vertus"
    ];

    constructor() {
        console.log('Hello GlobalService Provider');
        if(!this.DEVMODE) {
            this.BASE_URL = this.BASE_URL_API_PROD;
        }
        else {
            this.BASE_URL = this.BASE_URL_API_DEV;
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
