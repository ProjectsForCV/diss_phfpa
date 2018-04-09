import { Component, Input, OnInit } from '@angular/core';
import { AssignmentResults } from '../../../../services/http/interfaces/AssignmentResults';

@Component({
  selector: 'app-genetic-assignments',
  templateUrl: './genetic-assignments.component.html',
  styleUrls: ['./genetic-assignments.component.css']
})
export class GeneticAssignmentsComponent implements OnInit {

  @Input()
  public assignment: AssignmentResults[];
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
  ngOnInit() {
  }

}
