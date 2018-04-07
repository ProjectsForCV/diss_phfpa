import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GeneticOptions } from '../../../services/http/interfaces/GeneticOptions';
import { Assignment } from '../../../services/http/interfaces/Assignment';
import { HttpCostMatrixService } from '../../../services/http/http-cost-matrix';
import { GeneticAssignmentResults } from '../../../services/http/interfaces/GeneticAssignmentResults';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent implements OnInit {

  @Input() assignment: Assignment;

  @Input()
  public surveysComplete = false;

  @Input() assignmentId: string;

  @Input()
  public assignmentFinished = false;

  @Output()
  public refreshPage: EventEmitter<void> = new EventEmitter<void>();

  public selectedAlgorithm = 'hungarian';
  public geneticOptions: GeneticOptions = <GeneticOptions>{};

  public geneticResults: GeneticAssignmentResults[];

  constructor(public httpCostMatrix: HttpCostMatrixService) { }

  solve() {

    if (this.selectedAlgorithm === 'hungarian') {
      this.httpCostMatrix.postSolveAssignmentProblem(this.assignmentId, this.assignment.agents)
        .subscribe(
          res => {
            this.refreshPage.emit();
          }
        );
    } else {
      this.httpCostMatrix.postSolveAssignmentProblem(this.assignmentId, this.assignment.agents, this.geneticOptions)
        .subscribe(
          (res: GeneticAssignmentResults[]) => {
            this.geneticResults = res;
          }, err => console.error(err), () => console.dir(`Genetic Results returned`)
        );
    }
  }


  ngOnInit() {
    this.geneticOptions = <GeneticOptions> {
      mutationChance: 50,
      maxGenerations: 15,
      returnedCandidates: 3,
      populationSize: 40,
      groups: []
    };
  }

}
