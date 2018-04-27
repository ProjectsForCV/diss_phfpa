import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Alert } from './Alert';
import { AlertType } from './AlertType';

@Injectable()
export class AlertService {

  /**
   * A two way data stream that allows a component to publish new messages and subscribe to receive messages
   * @type {BehaviorSubject<any>}
   */
  errorMessageSubject: BehaviorSubject<Alert[]> = new BehaviorSubject(null);
  /**
   * Used to store a running record of error messages
   * @type {any[]}
   */
  errorMessagePool: Alert[] = [];

  /**
   * A two way data stream that allows a component to publish new messages and subscribe to receive messages
   * @type {BehaviorSubject<any>}
   */
  successMessageSubject: BehaviorSubject<Alert[]> = new BehaviorSubject(null);
  /**
   * Used to store a running record of success messages
   * @type {any[]}
   */
  successMessagePool: Alert[] = [];

  constructor() {
  }

  /**
   * pushes a new error message to the error message pool and alerts subscribers of the latest pool
   * @param {string} message
   */
  public error(message: string) {
    const alert: Alert = {
      message: message,
      index: this.errorMessagePool.length,
      type: AlertType.Error
    };
    this.errorMessagePool.push(alert);
    this.errorMessageSubject.next(this.errorMessagePool);
  }

  /**
   * removes an error from the pool and alerts subscribers of the latest pool
   * @param {Alert} alertToRemove
   */
  public removeError(alertToRemove: Alert) {
    this.errorMessagePool.splice(this.errorMessagePool.findIndex(alert => alert === alertToRemove), 1);

    this.errorMessageSubject.next(this.errorMessagePool);
  }
  /**
   * removes a success from the pool and alerts subscribers of the latest pool
   * @param {Alert} alertToRemove
   */
  public removeSuccess(alertToRemove: Alert) {
    this.successMessagePool.splice(this.successMessagePool.findIndex(alert => alert === alertToRemove), 1);
    this.successMessageSubject.next(this.successMessagePool);
  }

  /**
   * adds a success to the pool an dlaerts subscribers of the latest pool
   * @param {string} message
   */
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
