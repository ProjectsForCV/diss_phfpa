/***********************************************************************
 * Date: 28/01/2018
 * Author: Daniel Cooke
 ***********************************************************************/
/*
 DCOOKE 28/01/2018 - This is the actual matrix component, or "grid" that the user can interact with to update the cost
 matrix.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

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
  private colWidth: string;
  private gettingMatrix: Subscription;

  @Output()
  public totalCostChanged: EventEmitter<number> = new EventEmitter<number>(null);
  public totalCost = 0;
  constructor() { }

  ngOnInit() {

    this.gettingMatrix = this.matrixListener.subscribe(
      (matrix) => {
        this.matrix = matrix;

        this.solution = undefined;
        this.resetGridInTemplate();

      }
    );

    if (this.solutionListener) {
      this.solutionListener.subscribe(
        (solution) => {

          this.totalCost = 0;
          this.solution = solution;
          this.totalCostChanged.emit(this.getTotalCost());
          this.resetGridInTemplate();
        }
      );
    }
  }

  getTotalCost() {

    if (this.matrix && this.solution) {

      return this.matrix.reduce((acc, curr, i) => {

        const solvedIndex = this.solution[i].findIndex((val) => val === 1);

        if (solvedIndex >= 0) {


          return acc + curr[solvedIndex];
        } else {
          return acc;
        }
      }, 0);
    }
  }

  /*
   DCOOKE 28/01/2018 - this class will be used to update the appearance of the grid in the event of a solution.
   */
  getClass(row, col) {
    if (this.solution && this.solution[row][col] === 1) {
      return 'optimumCell ' + this.getCostColor(this.matrix[row][col]);
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

    this.colWidth = this.getWidth();
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

  /*
   DCOOKE 28/03/2018 - Gets the width for a cell based on the number of rows and columns
   */
  getWidth() {
    const rows = this.matrix.length;
    const cols = this.matrix[0].length;

    console.log(100 / cols);

    return `${100 / cols}%`;
  }

  private getCostColor(cost: number) {


    switch (cost) {
      case 1 : return 'one-cost-color';
      case 2 : return `two-cost-color`;
      case 3 : return 'three-cost-color';
      case 4 : return 'four-cost-color';
      case 5 : return 'five-cost-color';
      case 6 : return 'six-cost-color';
      case 7 : return 'seven-cost-color';
      case 8 : return 'eight-cost-color';
      case 9 : return 'nine-cost-color';
      case 10 : return 'ten-cost-color';
      default : return 'ten-cost-color';
    }


  }
}
