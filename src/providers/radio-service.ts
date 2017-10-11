import 'rxjs/add/operator/map';
import { Injectable }     from '@angular/core';
import { Http }           from '@angular/http';
import { GlobalService }  from '../providers/global-service';
import { Events }         from "ionic-angular";

@Injectable()
export class RadioService {

  private loopInterval = 3000;
  private timer:any;
  private currentSong = { cover: { jpg:'', svg:''  }, title:'', artist:'', track:'' };
  private lastSongs:{ cover: { jpg:'', svg:''  }, title:string, artist:string, track:string }[];
  constructor(public http: Http, private vars:GlobalService, private events: Events) {
    console.log('Hello RadioService Provider');
  }

  initLoop(interval?:number) {
    if(this.timer) {
      clearTimeout(this.timer);
    }
    this.getApiSongs().subscribe(
        data => {
          let hasChanged = (this.currentSong.title !== data.songs[0].title);
          if(hasChanged) {
            this.lastSongs = data.songs.map((song)=> {
              let result = {
                cover: song.cover,
                title: song.title || '',
                artist: song.title.split(" - ")[0],
                track: song.title.split(" - ")[1]
              };
              return result;
            });

            this.currentSong = this.lastSongs.shift();

            this.events.publish('nowPlayingChanged', this.currentSong, this.lastSongs);
          }
          this.timer = setTimeout(()=>this.initLoop(), interval? interval : this.loopInterval);
        },
        error => this.events.publish('onError', error)
    );
  }

  getApiSongs() {
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

    const defaultTags = [
      "sample",
      "jingle",
      "faubourg simone",
      "fabourg simone", // lol
      "flash calepin"
    ];

    const defaultTagsFridayWear = [
      "Friday Wear"
    ];

    const defaultTagsNouveaute = [
      "nouveauté",
      "nothing",
      "nouveaute"
    ];

    data.songs = data.songs.map((song)=>{

      let checkIfTagFor = function(titleToCompare, tagArray, coverIfFound) {
        let coverToGet = null;
        // Vérifie si le tableau de tags comprend une expression dans le titre courant si c'est le cas, renvoie la cover associee
        tagArray.forEach((tag, index)=> {
          if (titleToCompare.toLowerCase().indexOf(tag.toLowerCase()) > -1) {
            coverToGet = coverIfFound;
            return false;
          }
        });
        return coverToGet;
      };

      let coverToGet = null;
      if(song.album_cover.indexOf('pochette-default') > -1) {
        coverToGet = this.vars.COVER_DEFAULT;
      }
      // url de friday wear
      if (coverToGet === null) {
        coverToGet = checkIfTagFor(song.title, defaultTagsFridayWear, this.vars.COVER_DEFAULT_FRIDAY_WEAR);
      }
      // url des nouveautés
      if (coverToGet === null) {
        coverToGet = checkIfTagFor(song.title, defaultTagsNouveaute, this.vars.COVER_DEFAULT_NOUVEAUTE);
      }
      // url si tag par défaut
      if (coverToGet === null) {
        coverToGet = checkIfTagFor(song.title, defaultTags, this.vars.COVER_DEFAULT);
      }
      // url de l'api
      if (coverToGet === null) {
        coverToGet = {
          jpg: song.album_cover,
          svg: song.album_cover
        };
      }

      return {
        cover: coverToGet,
        title: song.title
      }
    });
    return data;
  }
}
