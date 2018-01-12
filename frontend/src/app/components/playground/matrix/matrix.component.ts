import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Cell } from './cell';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnInit , OnChanges{

  @Input()
  public matrix: number[][];

  @Input()
  public solution: number[][];

  public grid: Cell[][];
  constructor() { }

  ngOnInit() {
    this.constructMatrix();
  }

  ngOnChanges(){
    this.grid = undefined;
    if(this.matrix){
      this.constructMatrix();
    }

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

    this.grid = this.matrix.map((row, rowIndex) =>{

      return row.map((val, colIndex) => {
        return {
          name: `${rowIndex}${colIndex}`,
          value: val
        };
      });
    });
  }

}
