/***********************************************************************
 * Date: 28/01/2018
 * Author: Daniel Cooke
 ***********************************************************************/
/*
 DCOOKE 28/01/2018 - This component will allow the user to play around with the algorithm using a custom defined matrix
 */
import { Component, OnInit } from '@angular/core';
import { HttpCostMatrixService } from '../../services/http/http-cost-matrix';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AlertService } from '../../services/alert-service/alert-service';
import { ErrorHandlingService } from '../../services/error-handling-service/error-handling-service';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {

  /*
   DCOOKE 28/01/2018 - parent "stream" object , this will be passed to all children who require updates on the state of
   of matrix object. In order to send data to this stream a publisher just needs to call the method .next() with the
   matrix as the parameter.

   In order to receive asynchronous updates from the stream ,ie the latest matrix. A subscriber just need to call the
   .subscribe() method and pass in 3 callbacks to handle the data.
   */
  public matrixSubscriber: BehaviorSubject<number[][]> = new BehaviorSubject<number[][]>(null);
  public matrix: number[][];

  /*
   DCOOKE 28/01/2018 - This is similar to the matrix subscriber , the only difference is this object is concerned with
   updates to the solution to the latest matrix, this will be updated from the web service call.
   */
  public solutionSubscriber: BehaviorSubject<number[][]> = new BehaviorSubject<number[][]>(null);

  constructor(public http: HttpCostMatrixService, public errorService: ErrorHandlingService) { }


  /*
   DCOOKE 28/01/2018 - This method will be called when the user clicks the "Solve" button. It will make a webservice
   call and publish any returned data to the solution stream.
   */

  // TODO: Add error messages for user
  solve() {
    this.http.postSolveMatrix(this.matrix)
      .subscribe(
        (res) => {
          this.solutionSubscriber.next(res.json());
        },
          err => this.errorService.handleError(err),
        () => console.dir('HTTP Post complete')
      );
  }

  ngOnInit() {
    this.matrixSubscriber.subscribe(
      (mat) => {
        this.matrix = mat;

      }
    );
  }

}
