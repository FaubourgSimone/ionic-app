export class RadioPlayer {
    url:string;
    stream:any;
    promise:any;

    constructor() {
        this.url = "http://91.121.65.131:1337/faubourgsimone";
        this.stream = new Audio(this.url);
    };

    play() {
        this.stream.play();
        this.promise = new Promise((resolve,reject) => {
            this.stream.addEventListener('playing', () => {
                resolve(true);
            });

            this.stream.addEventListener('error', () => {
                reject(false);
            });
        });

        return this.promise;
    };

    pause() {
        this.stream.pause();
    };

}