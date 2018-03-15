import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Alert } from './Alert';
import { AlertType } from './AlertType';

@Injectable()
export class AlertService {

  errorMessageSubject: BehaviorSubject<Alert[]> = new BehaviorSubject(null);
  errorMessagePool: Alert[] = [];

  successMessageSubject: BehaviorSubject<Alert[]> = new BehaviorSubject(null);
  successMessagePool: Alert[] = [];

  constructor() {
  }

  public error(message: string) {
    const alert: Alert = {
      message: message,
      index: this.errorMessagePool.length,
      type: AlertType.Error
    };
    this.errorMessagePool.push(alert);
    this.errorMessageSubject.next(this.errorMessagePool);
  }

  public removeError(alertToRemove: Alert) {
    this.errorMessagePool.splice(this.errorMessagePool.findIndex(alert => alert === alertToRemove), 1);

    this.errorMessageSubject.next(this.errorMessagePool);
  }

  public removeSuccess(alertToRemove: Alert) {
    this.successMessagePool.splice(this.successMessagePool.findIndex(alert => alert === alertToRemove), 1);
    this.successMessageSubject.next(this.successMessagePool);
  }

  public success(message: string) {
    const alert: Alert = {
      message: message,
      index: this.successMessagePool.length,
      type: AlertType.Success
    };
    this.successMessagePool.push(alert);
    this.successMessageSubject.next(this.successMessagePool);
  }




}
