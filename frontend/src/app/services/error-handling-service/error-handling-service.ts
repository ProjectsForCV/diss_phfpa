import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AlertService } from '../alert-service/alert-service';

@Injectable()
export class ErrorHandlingService {

  constructor(public alertService: AlertService) {

  }

  public handleError(r: Response) {
    if (r.status === 0){
      this.alertService.error('There was a problem contacting the server. Please try again later.');
    }

    if (r.status === 500) {
      this.alertService.error(r.statusText);
    }
  }
}
