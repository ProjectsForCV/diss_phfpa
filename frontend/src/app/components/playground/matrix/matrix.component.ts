/***********************************************************************
 * Date: 28/01/2018
 * Author: Daniel Cooke
 ***********************************************************************/
/*
 DCOOKE 28/01/2018 - This is the actual matrix component, or "grid" that the user can interact with to update the cost
 matrix.
 */
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnInit {

  /*
   DCOOKE 28/01/2018 - This will be received from the parent component on init, it will allow this component to receive
   asynchronous updates on the state of the matrix component in case the user generates a new one.
   */
  @Input()
  public matrixListener: BehaviorSubject<number[][]>;
  public matrix: number[][];

  /*
   DCOOKE 28/01/2018 - This object will also be received from the parent, it is required to receive asynchronous updates
   on the solution to the current matrix.
   */
  @Input()
  public solutionListener: BehaviorSubject<number[][]>;

  public solution: number[][];

  /*
   DCOOKE 28/01/2018 - This is a local copy of the matrix object to prevent change detection problems - this will be
   used in the template.
   */
  public grid: number[][];
  constructor() { }

  ngOnInit() {

    this.matrixListener.subscribe(
      (matrix) => {
        this.matrix = matrix;
        this.solution = undefined;
        this.resetGridInTemplate();

      }
    );

    this.solutionListener.subscribe(
      (solution) => {
        this.solution = solution;
        this.resetGridInTemplate();
      }
    );
  }


  /*
   DCOOKE 28/01/2018 - this class will be used to update the appearance of the grid in the event of a solution.
   */
  getClass(row, col) {
    if (this.solution && this.solution[row][col] === 1) {
      return 'optimumCell';
    } else {
      return 'regularCell';
    }
  }

  /*
   DCOOKE 28/01/2018 - this method basically resets the grid in the template, it will be called anytime there is a
   change to the solution or the grid.
   */
  resetGridInTemplate () {

    this.grid = undefined;
    if (!this.matrix) {
      return;
    }


    this.grid = this.matrix.slice();
  }

  /*
   DCOOKE 28/01/2018 - this is the event listener for anytime a value is changed within the template grid, it publishes
   the latest matrix back up to the parent component and to all other subscribers.
   */
  valueChanged(row, col, val) {
    this.grid[row][col] = parseInt(val, 10);
    this.matrixListener.next(this.grid);
  }
}
