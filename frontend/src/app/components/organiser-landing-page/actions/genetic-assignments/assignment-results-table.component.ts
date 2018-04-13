import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AssignmentResults } from '../../../../services/http/interfaces/AssignmentResults';

@Component({
  selector: 'app-assignment-results-table',
  templateUrl: './assignment-results-table.component.html',
  styleUrls: ['./assignment-results-table.component.css']
})
export class AssignmentResultsTableComponent implements OnInit, OnChanges {


  @Input()
  public assignment: AssignmentResults[];
  @Output()
  public totalCostChanged: EventEmitter<number> = new EventEmitter<number>();

  public totalCost = 0;
  constructor() { }


  getCostClass(cost: number) {
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


  calulateTotalCost() {
    this.totalCost = this.assignment.reduce((cost, curr) => cost += curr.cost, 0);
    this.totalCostChanged.emit(this.totalCost);
  }
  ngOnInit() {

    this.calulateTotalCost();
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.calulateTotalCost();
  }

}
