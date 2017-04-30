import { ErrorHandler } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';

export class CustomErrorHandler extends IonicErrorHandler implements ErrorHandler {

    constructor() {
        super();
    }

    handleError(err: any): void {
        console.log('CustomErrorHandler Error: ' + err);
        // super.handleError(err);
        alert(err.toString());
    }

}