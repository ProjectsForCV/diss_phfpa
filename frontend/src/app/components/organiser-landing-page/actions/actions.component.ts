import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GeneticOptions } from '../../../services/http/interfaces/GeneticOptions';
import { Assignment } from '../../../services/http/interfaces/Assignment';
import { HttpCostMatrixService } from '../../../services/http/http-cost-matrix';
import { GeneticAssignmentResults } from '../../../services/http/interfaces/GeneticAssignmentResults';
import { SolveOptions } from '../../playground/SolveOptions';
import { HttpEmailService } from '../../../services/http/http-email-service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AssignmentResults } from '../../../services/http/interfaces/AssignmentResults';
import { SolutionService } from '../../../services/solution-service';
import { HttpAssignmentService } from '../../../services/http/http-assignment-service';
import { ErrorHandlingService } from '../../../services/error-handling-service/error-handling-service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css'],
  animations: [
    trigger('panelState', [
      state('collapsed', style({
        'height': '0px',
        'overflow' : 'hidden'

      })),
      state('expanded',   style({
        'height': '*'
      })),

      transition('collapsed <=> expanded', animate(300))

    ])
  ]
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

  public solveOptions: SolveOptions = <SolveOptions> {
    algorithm: 'hungarian',
    geneticOptions: <GeneticOptions>{}
  };

  public selectedAlgorithm = 'hungarian';

  public loadingIcon = 'fa fa-spin fa-spinner';
  public regularIcon = 'glyphicon glyphicon-th';

  public solveIconClass: string;

  public geneticResults: GeneticAssignmentResults[];
  public hungarianResults: AssignmentResults[];

  public solveText = 'Find Optimum Assignment';
  public panelState = 'expanded';
  public expandButtonState = 'fa fa-angle-down';



  constructor(public httpCostMatrix: HttpCostMatrixService,
              public httpEmail: HttpEmailService,
              public solutionService: SolutionService,
              public httpAssignment: HttpAssignmentService,
              public errorService: ErrorHandlingService
  ) { }

  ngOnInit() {
    this.reset();
    this.solutionService.solutionPickedListener.subscribe(
      (res) => {
        this.finishAssignment(res);
      }
    );
  }

  finishAssignment(solution: AssignmentResults[]) {
    this.httpAssignment.postFinishAssignment(solution, this.assignmentId)
      .subscribe(
        (res) => {
              this.refreshPage.emit();
        }
      );
  }

  togglePanelState() {
    this.panelState = this.panelState === 'expanded' ? 'collapsed' : 'expanded';
    this.expandButtonState = this.panelState === 'expanded' ? 'fa fa-angle-up' : 'fa fa-angle-down';

  }


  solve() {

    this.isLoading(true);

    if (this.solveOptions.algorithm === 'hungarian') {
      this.hungarianResults = [];
      this.httpCostMatrix.postSolveAssignmentProblem(this.assignmentId, this.assignment.agents)
        .subscribe(
          res => {
            this.isLoading(false);
            this.hungarianResults = res.assignment;
          }
        );
    } else {

      this.geneticResults = [];
      this.httpCostMatrix.postSolveAssignmentProblem(this.assignmentId, this.assignment.agents, this.solveOptions.geneticOptions)
        .subscribe(
          (res: GeneticAssignmentResults[]) => {
            this.geneticResults = res;
            this.isLoading(false);

            this.togglePanelState();

          }, err => console.error(err), () => console.dir(`Genetic Results returned`)
        );
    }
  }

  isLoading(loading: boolean) {
    this.setSolveButtonIcon(loading);
  }
  setSolveButtonIcon(loading: boolean) {

    this.solveIconClass = loading ? this.loadingIcon : this.regularIcon;
    this.solveText = loading ? `Finding...` : 'Find Optimum Assignment';
  }


  sendSurveyLinks() {
    this.httpEmail.sendSurveyLinksToAgents(this.assignment.agents, this.assignment.taskAlias,
      this.assignment.agentAlias, this.assignment.organiserName)
      .subscribe(res => console.log(res),
        err => this.errorService.handleError(err)
      );
  }

  sendResults() {
    this.httpEmail.sendResultsToAgents(this.assignmentId)
      .subscribe(
        (res) => console.log(res),
        (err) => console.error(err),
        () => console.dir('Finished')
      );
  }

  reset() {
    this.solveOptions.geneticOptions = <GeneticOptions> {
      mutationChance: 50,
      maxGenerations: 15,
      returnedCandidates: 3,
      populationSize: 40,
      groups: [],
      distanceThreshold: 3
    };

    this.solveIconClass = this.regularIcon;
    this.geneticResults = [];
    this.hungarianResults = [];
  }


}
