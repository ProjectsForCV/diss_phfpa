import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AssignmentResults } from '../../../../services/http/interfaces/AssignmentResults';
import { AssignmentResultsTableComponent } from '../genetic-assignments/assignment-results-table.component';
import { SolutionService } from '../../../../services/solution-service';

@Component({
  selector: 'app-hungarian-results',
  templateUrl: './hungarian-results.component.html',
  styleUrls: ['./hungarian-results.component.css']
})
export class HungarianResultsComponent implements OnInit {

  @Input()
  public results: AssignmentResults[] = [];

  public table: AssignmentResultsTableComponent;
  public totalCost: number;
  constructor(
    public solutionService: SolutionService
  ) { }

  ngOnInit() {


  }

  postAsSolution() {
    this.solutionService.publishFoundSolution(this.results);
  }

  private updateTotalCost(cost: number) {
    this.totalCost = cost;
  }
}
