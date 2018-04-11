import { Component, Input, OnInit } from '@angular/core';
import { GeneticAssignmentResults } from '../../../../services/http/interfaces/GeneticAssignmentResults';
import { SolutionService } from '../../../../services/solution-service';

@Component({
  selector: 'app-genetic-results',
  templateUrl: './genetic-results.component.html',
  styleUrls: ['./genetic-results.component.css']
})
export class GeneticResultsComponent implements OnInit {

  @Input()
  public geneticResults: GeneticAssignmentResults[] = [];

  constructor(
    public solutionService: SolutionService
  ) { }

  ngOnInit() {


  }

  postAsSolution(results) {
    this.solutionService.publishFoundSolution(results);
  }

  getBorder(i) {
    return i === 0 ? '3px dashed #114B5F' : undefined;
  }
}
