/***********************************************************************
 * Date: 28/01/2018
 * Author: Daniel Cooke
 ***********************************************************************/
/*
 DCOOKE 28/01/2018 - This component will allow the user to play around with the algorithm using a custom defined matrix
 */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpCostMatrixService } from '../../services/http/http-cost-matrix';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorHandlingService } from '../../services/error-handling-service/error-handling-service';
import { Subscription } from 'rxjs/Subscription';
import { GeneticOptions } from '../../services/http/interfaces/GeneticOptions';
import { GeneticMatrix } from './GeneticMatrix';
import { SolveOptions } from './SolveOptions';
import { MatrixComponent } from './matrix/matrix.component';
import { AssignmentResults } from '../../services/http/interfaces/AssignmentResults';




@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {

  @ViewChild('resultMatrix')
  public matrixComponent: MatrixComponent;
  /*
   DCOOKE 28/01/2018 - parent "stream" object , this will be passed to all children who require updates on the state of
   of matrix object. In order to send data to this stream a publisher just needs to call the method .next() with the
   matrix as the parameter.

   In order to receive asynchronous updates from the stream ,ie the latest matrix. A subscriber just need to call the
   .subscribe() method and pass in 3 callbacks to handle the data.
   */
  public matrixSubscriber: BehaviorSubject<number[][]> = new BehaviorSubject<number[][]>(null);
  public matrix: number[][];

  public geneticMatrices: GeneticMatrix[];
  public activeTab: string;

  /*
   DCOOKE 28/01/2018 - This is similar to the matrix subscriber , the only difference is this object is concerned with
   updates to the solution to the latest matrix, this will be updated from the web service call.
   */
  public solutionSubscriber: BehaviorSubject<number[][]> = new BehaviorSubject<number[][]>(null);
  public solvingHungarian: Subscription;
  public solvingGenetic: Subscription;
  public loadingIcon = 'fa fa-spin fa-spinner';
  public regularIcon = 'glyphicon glyphicon-th';

  public solveIconClass: string;

  public options: SolveOptions = <SolveOptions> {
    algorithm: 'hungarian',
    geneticOptions: <GeneticOptions> {
      distanceThreshold: 3,
      groups: [],
      returnedCandidates: 3,
      populationSize: 40,
      maxGenerations: 15,
      mutationChance: 50
    }
  };
  public solution: number[][];
  private totalCost: number;
  private hungarianAssignment: AssignmentResults[];




  constructor(public http: HttpCostMatrixService, public errorService: ErrorHandlingService) { }


  /*
   DCOOKE 28/01/2018 - This method will be called when the user clicks the "Solve" button. It will make a webservice
   call and publish any returned data to the solution stream.
   */

  solve() {
    // DCOOKE 09/04/2018 - Set loading flag
    this.isLoading(true);

    if (this.options && this.options.algorithm === 'hungarian') {
      this.geneticMatrices = undefined;
      this.solution = undefined;
      this.solvingHungarian = this.http.postSolveMatrix(this.matrix, undefined, this.getRowNames(), this.getColNames())
        .subscribe(
          (res) => {

            this.solutionSubscriber.next(res.solution);
            this.hungarianAssignment = res.assignment;
          },
          err => this.errorService.handleError(err),
          () => this.isLoading(false)
        );
    } else {
      this.geneticMatrices = undefined;
      this.solution = undefined;
      this.solvingGenetic = this.http.postSolveMatrix(this.matrix, this.options.geneticOptions ,this.getRowNames(), this.getColNames())
        .subscribe(
          (res) => {
            return this.geneticMatrices = res;
          },
          (err) => this.errorService.handleError(err),
          () => this.isLoading(false)
        )
      ;
    }
  }

  getRowNames() {
    return this.matrix.map((val, index) => {
      return `Agent ${index + 1}`;
    });
  }

  getColNames() {
    return this.matrix[0].map((val, index) => {
      return `Task ${index + 1}`;
    });
  }

  isLoading(loading: boolean) {
    this.setSolveButtonIcon(loading);
  }
  setSolveButtonIcon(loading: boolean) {

    this.solveIconClass = loading ? this.loadingIcon : this.regularIcon;
  }

  hungarianTotalCostChanged(cost: number) {
    this.totalCost = cost;
  }



  ngOnInit() {

    this.setSolveButtonIcon(false);
    this.matrixSubscriber.subscribe(
      (mat) => {

        if (!mat) {
          this.solution = undefined;
          this.solutionSubscriber.next(null);
          this.geneticMatrices = undefined;
          this.solvingGenetic = undefined;
          this.solvingHungarian = undefined;
        }
        this.matrix = mat;
        this.costMatrixChanged();

      }
    );

    this.solutionSubscriber.subscribe(
      (solution) => {
        if (solution) {

          this.solution = solution;

        }
      }
    );
  }
  costMatrixChanged() {
    this.resetOptions();
    this.activeTab = 'matrix';

  }

  resetOptions() {
    this.options = <SolveOptions> {
      algorithm: 'hungarian',
      geneticOptions: <GeneticOptions> {
        distanceThreshold: 3,
        groups: [],
        returnedCandidates: 3,
        populationSize: 40,
        maxGenerations: 15,
        mutationChance: 50
      }
    };
  }

}
