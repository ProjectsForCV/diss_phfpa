import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpAssignmentService } from '../../services/http/http-assignment-service';
import { Assignment } from '../../services/http/interfaces/Assignment';
import { HttpEmailService } from '../../services/http/http-email-service';

@Component({
  selector: 'app-organiser-landing-page',
  templateUrl: './organiser-landing-page.component.html',
  styleUrls: ['./organiser-landing-page.component.css']
})
export class OrganiserLandingPageComponent implements OnInit {

  public assignmentId: string;

  public assignment: Assignment;
  constructor(public route: ActivatedRoute,
              public http: HttpAssignmentService
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

  private getAssignment() {
    this.http.getAssignmentInfo(this.assignmentId)
      .subscribe(
        (res: Assignment) => {
          this.assignment = res;
          console.log(this.assignment);
        }
      );
  }
}
