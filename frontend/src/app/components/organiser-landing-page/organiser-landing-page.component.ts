import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpAssignmentService } from '../../services/http/http-assignment-service';
import { Assignment } from '../../services/http/interfaces/Assignment';
import { HttpEmailService } from '../../services/http/http-email-service';
import { HttpCostMatrixService } from '../../services/http/http-cost-matrix';
import { Agent } from '../../services/http/interfaces/Agent';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { ErrorHandlingService } from '../../services/error-handling-service/error-handling-service';

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
  private atLeastOneSurveyAnswered: boolean;
  public loadingAssignment: Subscription;
  constructor(public route: ActivatedRoute,
              public http: HttpAssignmentService,
              public httpCostMatrix: HttpCostMatrixService,
              public httpEmail: HttpEmailService,
              public san: DomSanitizer,
              public error: ErrorHandlingService
  ) {

  }

  sendOrganserEmail() {
    this.httpEmail.sendLandingPageLinkToOrganiser(this.assignmentId)
      .subscribe(res => console.log(res));
  }
  sendTasksToAgents () {
    this.httpEmail.sendResultsToAgents(this.assignmentId)
      .subscribe(res => console.log(res));
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

  public getSafeImageURL() {
    if (this.assignment.image) {

      return this.san.bypassSecurityTrustStyle(`url(${this.assignment.image})`);
    } else {
      return 'none';
    }
  }
  private getAssignment() {

    this.loadingAssignment = this.http.getAssignmentInfo(this.assignmentId)
      .subscribe(
        (res: Assignment) => {
          this.assignment = res;
          this.atLeastOneSurveyAnswered =
            this.assignment.agents.map(agent => agent.answers).filter(answer => !!answer).length > 0;

          this.areAllSurveysFinished();
          console.log(this.assignment);
        },
        (err) => this.error.handleError(err)
      );
  }


}
