import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GeneticMatrix } from '../GeneticMatrix';
import { Agent } from '../../../services/http/interfaces/Agent';
import { Task } from '../../../services/http/interfaces/Task';
import { AssignmentResults } from '../../../services/http/interfaces/AssignmentResults';
@Component({
  selector: 'app-display-genetic-matrices',
  templateUrl: './display-genetic-matrices.component.html',
  styleUrls: ['./display-genetic-matrices.component.css']
})
export class DisplayGeneticMatricesComponent implements OnInit, OnChanges {


  @Input()
  public results: GeneticMatrix[];

  @Input()
  public costMatrix: number[][];

  constructor() { }


  ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges): void {
  }
  getClass(solutionIndex, row, col) {
    if (this.results && this.results[solutionIndex].solution[row][col] === 1) {
      return 'optimumCell ' + this.getCostColor(this.costMatrix[row][col]);
    } else {
      return 'regularCell';
    }
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
