import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpAssignmentService } from '../../services/http/http-assignment-service';
import { Assignment } from '../../services/http/interfaces/Assignment';
import { HttpEmailService } from '../../services/http/http-email-service';
import { HttpCostMatrixService } from '../../services/http/http-cost-matrix';
import { Agent } from '../../services/http/interfaces/Agent';

@Component({
  selector: 'app-organiser-landing-page',
  templateUrl: './organiser-landing-page.component.html',
  styleUrls: ['./organiser-landing-page.component.css']
})
export class OrganiserLandingPageComponent implements OnInit {

  public assignmentId: string;

  public assignment: Assignment;

  public numberOfCompletedSurveys: number;
  private allSurveysFinished: boolean;
  constructor(public route: ActivatedRoute,
              public http: HttpAssignmentService,
              public httpCostMatrix: HttpCostMatrixService
  ) {

  }

  sendEmail() {

  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.assignmentId = params['assignmentId'];
        this.getAssignment();
      }
    );
  }

  areAllSurveysFinished() {
    this.numberOfCompletedSurveys = this.assignment.agents.filter(agent => agent.completed).length;
    this.allSurveysFinished = this.numberOfCompletedSurveys === this.assignment.agents.length;
  }

  private getAssignment() {

    this.http.getAssignmentInfo(this.assignmentId)
      .subscribe(
        (res: Assignment) => {
          this.assignment = res;
          this.areAllSurveysFinished();
          console.log(this.assignment);
        }
      );
  }

  solveMat() {

    if (this.numberOfCompletedSurveys === this.assignment.agents.length) {
      this.httpCostMatrix.postSolveAssignmentProblem(this.assignmentId, this.assignment.agents)
        .subscribe(
          res => console.log(res)
        );
    }

  }


}
