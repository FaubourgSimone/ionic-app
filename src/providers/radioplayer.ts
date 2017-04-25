export class RadioPlayer {
    url:string;
    stream:any;
    promise:any;
    public isPlaying:boolean = false;

    constructor() {
    }

    init(url:string) {
        this.url = url;
        // TODO : verifier que l'url est accessible
    }

    play() {
        this.isPlaying = true;
        this.stream = new Audio(this.url);
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
        this.isPlaying = false;
        this.stream.pause();
    }

}