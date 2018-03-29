import { Component, OnInit } from '@angular/core';
import { HttpAssignmentService } from '../../services/http/http-assignment-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-agent-landing-page',
  templateUrl: './agent-landing-page.component.html',
  styleUrls: ['./agent-landing-page.component.css'],
  providers: [HttpAssignmentService]
})
export class AgentLandingPageComponent implements OnInit {

  public surveyID;
  public availableTasks: string[] = [
    'Mock Task 1',
    'Mock Task 2',
    'Mock Task 3',
    'Mock Task 4',
    'Mock Task 5',
    'Mock Task 6',
    'Mock Task 7',
    'Mock Task 8',
    'Mock Task 9',
    'Mock Task 10',
  ];
  public selectedTasks: string[] = [];

  public availableTaskFilter = '';
  public filteredList: string[];
  constructor(public http: HttpAssignmentService, public route: ActivatedRoute) { }


  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.surveyID = params['surveyId'];
      this.getSurveyInfo(this.surveyID);
    });

    this.filteredList = this.availableTasks;


  }


  filterList(filter) {

    this.availableTaskFilter = filter;
    this.filteredList =  this.availableTasks.filter(val => val.includes(this.availableTaskFilter));
  }
  getSurveyInfo(id: string) {
    this.http.getSurveyInfo(id);
  }

  getTaskAlias() {
    return `tasks`;
  }

  taskDragged(e) {
    console.log(e);
  }
}
