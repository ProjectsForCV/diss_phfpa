import { Component, Input, OnInit } from '@angular/core';
import { GeneticAssignmentResults } from '../../../../services/http/interfaces/GeneticAssignmentResults';

@Component({
  selector: 'app-genetic-results',
  templateUrl: './genetic-results.component.html',
  styleUrls: ['./genetic-results.component.css']
})
export class GeneticResultsComponent implements OnInit {

  @Input()
  public geneticResults: GeneticAssignmentResults[] = [];

  constructor() { }

  ngOnInit() {

  }

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

}
