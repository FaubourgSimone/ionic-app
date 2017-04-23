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
                    return this.filterDefaultCovers(res.json());
                }
            });
    }

    filterDefaultCovers(data) {
        console.log('InformationService.filterDefaultCovers ', data);
        let defaultCoverUrl = "assets/images/cover-default.jpg";
        let defaultTags = [
            "sample",
            "jingle",
            "faubourg simone",
            "flash calepin"
        ];
        let defaultCoverFridayWearUrl = "assets/images/cover-friday-wear.jpg";
        let defaultTagsFridayWear = [
            "Friday Wear"
        ];
        let defaultCoverNouveauteUrl = "assets/images/cover-news.jpg";
        let defaultTagsNouveaute = [
            "nouveauté",
            "nothing",
            "nouveaute"
        ];

        data.songs = data.songs.map((song)=>{

            let checkIfTagFor = function(titleToCompare, tagArray, urlIfFound) {
                var coverToGet = null;
                // Vérifie si le tableau de tags comprend une expression dans le titre courant
                // si c'est le cas, renvoie l'url associée
                tagArray.forEach((tag, index)=> {
                    console.log('------->', index, tag);
                    if (titleToCompare.toLowerCase().indexOf(tag.toLowerCase()) > -1) {
                        console.log('---------------------> ', urlIfFound);
                        coverToGet = urlIfFound;
                        return false;
                    }
                });
                return coverToGet;
            };

            let coverToGet = null;
            // url de friday wear
            if (coverToGet === null) {
                coverToGet = checkIfTagFor(song.title, defaultTagsFridayWear, defaultCoverFridayWearUrl);
            }
            // url des nouveautés
            if (coverToGet === null) {
                coverToGet = checkIfTagFor(song.title, defaultTagsNouveaute, defaultCoverNouveauteUrl);
            }
            // url si tag par défaut
            if (coverToGet === null) {
                coverToGet = checkIfTagFor(song.title, defaultTags, defaultCoverUrl);
            }
            // url de l'api
            if (coverToGet === null) {
                coverToGet = song.album_cover;
            }

            return {
                album_cover: coverToGet,
                title: song.title
            }
        });

        return data;
    }
}