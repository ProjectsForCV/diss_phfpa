/***********************************************************************
 * Date: 28/01/2018
 * Author: Daniel Cooke
 ***********************************************************************/
/*
 DCOOKE 28/01/2018 - the component that allows the user to generate a new cost matrix
 */
import { Component, Input, OnInit } from '@angular/core';
import { HttpCostMatrixService } from '../../../services/http/http-cost-matrix';
import {  FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorHandlingService } from '../../../services/error-handling-service/error-handling-service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css'],
  providers: [HttpCostMatrixService]
})
export class GeneratorComponent implements OnInit {

  public rowsControl: FormControl;
  public colsControl: FormControl;

  /*
   DCOOKE 28/01/2018 - received from parent component, used to publish any newly generated matrices to the stream
   */
  @Input()
  public matrixSubscription: BehaviorSubject<number[][]>;
  private gettingMatrix: Subscription;


  constructor(public http: HttpCostMatrixService, public errorService: ErrorHandlingService) { }

  ngOnInit() {
    this.setupForm();
  }

  /*
   DCOOKE 28/01/2018 - setups form controls in the template to accept user input
   */
  setupForm () {
    this.rowsControl = new FormControl(0);
    this.colsControl = new FormControl(0);
  }

  /*
   DCOOKE 28/01/2018 - webservice call will be made if the "Fill" checkbox is ticked, otherwise an empty grid will be
   initialised.
   */
  generate() {


    this.matrixSubscription.next(null);
    this.gettingMatrix = this.http.getRandomMatrix(this.rowsControl.value, this.colsControl.value)
      .subscribe(
        (res) => {
          console.log(res);
          this.updateMatrix(res);
        },
        (err) => {
          this.errorService.handleError(err);
        },
        () => {
          console.dir('HTTP Call complete');
        }
      );


  }

  /*
   DCOOKE 28/01/2018 - this method will publish the latest matrix back to its subscribers
   */
  updateMatrix(newMatrix: any) {
    this.matrixSubscription.next(newMatrix);
  }
}
