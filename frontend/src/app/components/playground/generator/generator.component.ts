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

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css'],
  providers: [HttpCostMatrixService]
})
export class GeneratorComponent implements OnInit {

  public rowsControl: FormControl;
  public colsControl: FormControl;
  public fillControl: FormControl;

  /*
   DCOOKE 28/01/2018 - received from parent component, used to publish any newly generated matrices to the stream
   */
  @Input()
  public matrixSubscription: BehaviorSubject<number[][]>;


  constructor(public http: HttpCostMatrixService) { }

  ngOnInit() {
    this.setupForm();
  }

  /*
   DCOOKE 28/01/2018 - setups form controls in the template to accept user input
   */
  setupForm () {
    this.rowsControl = new FormControl(0);
    this.colsControl = new FormControl(0);
    this.fillControl = new FormControl(0);
  }

  /*
   DCOOKE 28/01/2018 - webservice call will be made if the "Fill" checkbox is ticked, otherwise an empty grid will be
   initialised.
   */
  generate() {

    if (this.fillControl.value) {

      this.http.getRandomMatrix(this.rowsControl.value, this.colsControl.value)
        .subscribe(
          (res) => {
            console.log(res.json());
            this.updateMatrix(res.json());
          },
          (err) => {
            console.error(err);
          },
          () => {
            console.dir('HTTP Call complete');
          }
        );
    } else {
      // TODO: handle case where user does not want a randomly filled matrix
    }

  }

  /*
   DCOOKE 28/01/2018 - this method will publish the latest matrix back to its subscribers
   */
  updateMatrix(newMatrix: any) {
    this.matrixSubscription.next(newMatrix);
  }
}
