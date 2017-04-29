import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { GlobalService } from '../providers/global-service';

/*
  Generated class for the RadioService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RadioService {

  constructor(public http: Http, private vars:GlobalService) {
    console.log('Hello RadioService Provider');
  }

  getCurrentSongs() {
    return this.http
        .get(this.vars.URL_COVERS_API)
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
    let defaultCoverUrl = "assets/images/cover-default.jpg";
    let defaultTags = [
      "sample",
      "jingle",
      "faubourg simone",
      "fabourg simone", // lol
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
        // Vérifie si le tableau de tags comprend une expression dans le titre courant si c'est le cas, renvoie l'url associée
        tagArray.forEach((tag, index)=> {
          if (titleToCompare.toLowerCase().indexOf(tag.toLowerCase()) > -1) {
            coverToGet = urlIfFound;
            return false;
          }
        });
        return coverToGet;
      };

      let coverToGet = null;
      if(song.album_cover.indexOf('pochette-default') > -1) {
        song.album_cover = defaultCoverUrl;
      }
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
