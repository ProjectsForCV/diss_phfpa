import { Component, OnInit } from '@angular/core';
import { AlertService } from './alert-service';
import { Alert } from './Alert';
import { AlertType } from './AlertType';

@Component({
  selector: 'app-alert-service',
  templateUrl: './alert-service.component.html',
  styleUrls: ['./alert-service.component.css']
})
export class AlertServiceComponent implements OnInit {


  public successMessages: Alert[] = [];
  public errorMessages: Alert[] = [];
  constructor(public alertService: AlertService) { }

  remove(alert: Alert) {



    if (alert.type === AlertType.Error) {
      this.alertService.removeError(alert);
    }

    if (alert.type === AlertType.Success) {
      this.alertService.removeSuccess(alert);
    }
  }
  ngOnInit() {
    this.alertService.successMessageSubject.subscribe(
      successPool => {

        if (successPool) {
          this.successMessages = successPool;
        }
      }
    );
    this.alertService.errorMessageSubject.subscribe(
      errorPool => {
        if (errorPool) {
          this.errorMessages = errorPool;
        }
      }
    );
  }

}
