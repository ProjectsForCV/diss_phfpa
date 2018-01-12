import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnInit{

  @Input()
  public matrixListener: BehaviorSubject<number[][]>;

  public matrix: number[][];

  @Input()
  public solutionListener: BehaviorSubject<number[][]>;

  public solution: number[][];

  public grid: number[][];
  constructor() { }

  ngOnInit() {


    this.matrixListener.subscribe(
      (matrix) => {
        this.matrix = matrix;
        this.solution = undefined;
        this.constructMatrix();

      }
    );

    this.solutionListener.subscribe(
      (solution) => {
        this.solution = solution;
        this.constructMatrix();
      }
    )
  }


  getClass(row, col) {
    if(this.solution && this.solution[row][col] === 1) {
      return 'optimumCell';
    }
    else {
      return 'regularCell';
    }
  }

  constructMatrix () {

    this.grid = undefined;
    if (!this.matrix)
      return;

    this.grid = this.matrix.slice();
  }

  valueChanged(row, col, val) {


    this.grid[row][col] = parseInt(val,10);
    this.matrixListener.next(this.grid);
  }
}
