import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpAssignmentService } from '../../services/http/http-assignment-service';
import { Assignment } from '../../services/http/interfaces/Assignment';

@Component({
  selector: 'app-organiser-landing-page',
  templateUrl: './organiser-landing-page.component.html',
  styleUrls: ['./organiser-landing-page.component.css']
})
export class OrganiserLandingPageComponent implements OnInit {

  private assignmentId: string;

  constructor(public route: ActivatedRoute, public http: HttpAssignmentService) {

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
          console.log(res.assignmentTitle);
        }
      );
  }
}
