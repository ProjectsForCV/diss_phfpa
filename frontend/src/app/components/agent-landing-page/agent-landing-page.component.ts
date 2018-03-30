import { Component, OnInit } from '@angular/core';
import { HttpAssignmentService } from '../../services/http/http-assignment-service';
import { ActivatedRoute } from '@angular/router';
import { HttpSurveyService } from '../../services/http/http-survey-service';
import { ErrorHandlingService } from '../../services/error-handling-service/error-handling-service';
import { SurveyOptions } from '../../services/http/interfaces/SurveyOptions';

@Component({
  selector: 'app-agent-landing-page',
  templateUrl: './agent-landing-page.component.html',
  styleUrls: ['./agent-landing-page.component.css']
})
export class AgentLandingPageComponent implements OnInit {

  public surveyID;
  public availableTasks: string[] = [

  ];
  public selectedTasks: string[] = [];
  public negativeTasks: string[] = [];
  public taskAlias = '';

  public availableTaskFilter = '';
  public filteredList: string[];
  private surveyOptions: SurveyOptions;


  constructor(public http: HttpSurveyService,
              public route: ActivatedRoute,
              public error: ErrorHandlingService
              ) { }


  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.surveyID = params['surveyId'];
      this.getSurveyInfo(this.surveyID);
    });

    this.filteredList = this.availableTasks;




  }

  send() {

    // DCOOKE 30/03/2018 - map selectedTasks to their index - ie cost
    const leastCost = this.selectedTasks.map((task, index) => {
      return {
        taskName: task,
        cost: index + 1
      };
    });

    // DCOOKE 30/03/2018 - map negativeTasks to a high number so they aren't chosen
    const mostCost = this.negativeTasks.map((task) => {
      return {
        taskName: task,
        cost: 999
      };
    });

    const remainingCosts = this.filteredList.map((task) => {
      return {
        taskName: task,
        cost: this.surveyOptions.maxSelection + 1
      };
    });

    const answers = leastCost.concat(mostCost, remainingCosts);
    console.log(answers);
  }
  reset() {
    console.log(this.availableTasks);
    this.filteredList = this.availableTasks;
    this.negativeTasks = [];
    this.selectedTasks = [];
    this.filterList('');
  }


  filterList(filter) {

    this.availableTaskFilter = filter;
    this.filteredList =  this.availableTasks.filter(val => val.includes(this.availableTaskFilter));
  }

  getSurveyInfo(id: string) {

    this.http.getSurveyQuestions(id)
      .subscribe(
        (response) => {

          this.availableTasks = response['tasks'];
          this.taskAlias = response['taskAlias'];
          this.taskAlias = !!this.taskAlias ? this.taskAlias : 'Task';

          this.surveyOptions = <SurveyOptions> response['surveyOptions'];
          this.filterList('');
        },
        (err) => this.error.handleError(err),
        () => console.dir('HTTP survey call finished')
      );
  }


  taskDragged(e) {
    console.log(e);
  }
}
