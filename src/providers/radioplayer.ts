export class RadioPlayer {
    url:string;
    stream:any;
    promise:any;

    constructor() {
        console.log('Hello RadioPlayer');
    }

    init(url:string) {
        console.log('RadioPlayer.init: ', url);
        this.url = url;
        // TODO : verifier que l'url est accessible
        this.stream = new Audio(this.url);
        console.log(this.stream);
    }

    play() {
        this.promise = new Promise((resolve,reject) => {
            this.stream.addEventListener('playing', () => {
                resolve(true);
            });

            this.stream.addEventListener('error', () => {
                reject(false);
            });
        });
        this.stream.play();

        return this.promise;
    }

    pause() {
        this.stream.pause();
    }

}