import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpSurveyService } from '../../services/http/http-survey-service';
import { ErrorHandlingService } from '../../services/error-handling-service/error-handling-service';
import { SurveyOptions } from '../../services/http/interfaces/SurveyOptions';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Task } from 'app/services/http/interfaces/Task';

@Component({
  selector: 'app-agent-landing-page',
  templateUrl: './agent-landing-page.component.html',
  styleUrls: ['./agent-landing-page.component.css']
})
export class AgentLandingPageComponent implements OnInit {

  public surveyID;
  public allTasks: Task[];
  public availableTasks: Task[];
  public selectedTasks: Task[] = [];
  public negativeTasks: Task[] = [];
  public taskAlias = '';

  public availableTaskFilter = '';
  public filteredList: Task[];
  private surveyOptions: SurveyOptions;
  private lastAvailableTaskDraggedIndex: number;
  private deviceInfo: DeviceInfo;
  private confirmModalRef: BsModalRef;
  private completed: boolean;
  private agentAlias: string;


  constructor(public http: HttpSurveyService,
              public route: ActivatedRoute,
              public error: ErrorHandlingService,
              public dd: DeviceDetectorService,
              public modal: BsModalService,
              ) {


  }


  ngOnInit() {
    this.deviceInfo = this.dd.getDeviceInfo();
    this.route.params.subscribe((params) => {
      this.surveyID = params['surveyId'];
      this.getSurveyInfo(this.surveyID);
    });



  }

  isSupportedDevice() {
    const unsupportedDevices = [
      'iphone',
      'ipad',
      'android'
    ];
    if (unsupportedDevices.includes(this.deviceInfo.device)) {
      return false;
    }

    return true;
  }

  confirmSend(modalTemplate) {
    this.confirmModalRef = this.modal.show(modalTemplate);
  }
  send() {


    this.confirmModalRef.hide();
    // DCOOKE 30/03/2018 - map selectedTasks to their index - ie cost
    const leastCost = this.selectedTasks.map((task, index) => {
      return {
        TaskID: task.taskId,
        cost: index + 1
      };
    });

    // DCOOKE 30/03/2018 - map negativeTasks to a high number so they aren't chosen
    const mostCost = this.negativeTasks.map((task) => {
      return {
        TaskID: task.taskId,
        cost: 999
      };
    });

    const remainingCosts = this.filteredList.map((task) => {
      return {
        TaskID: task.taskId,
        cost: this.surveyOptions.maxSelection ? this.surveyOptions.maxSelection + 1 : this.allTasks.length
      };
    });


    const answers = leastCost.concat(mostCost, remainingCosts);
    const post = {
      surveyID: this.surveyID,
      answers: answers
    };
    console.log(post);
    this.http.postSurveyAnswers(post)
      .subscribe(
        res => {
          this.refreshPage();
        },
        err => console.error(err)
      );
  }

  refreshPage() {
      window.location.reload();
  }
  reset() {

    console.log(this.allTasks);
    this.availableTasks = this.allTasks.slice();
    this.negativeTasks = [];
    this.selectedTasks = [];
    this.filterList();
  }

  availableTaskDrag(e, index) {
    this.lastAvailableTaskDraggedIndex = index;
  }

  availableTasksDrop(e) {

    this.availableTasks.push(e.value);
    this.filterList();
  }


  selectedTaskDrop(e) {

    if ((this.selectedTasks.length <= this.surveyOptions.maxSelection) || this.surveyOptions.maxSelection === 0) {


      // Remove from all tasks
      this.availableTasks.splice(this.lastAvailableTaskDraggedIndex, 1);
      this.filterList();

    } else {
      // If they have reached the max number of selected tasks don't allow any more to be added
      this.selectedTasks.splice(this.selectedTasks.findIndex(t => t === e.value), 1);



      this.filterList();
    }
  }
  negativeTaskDrop(e) {
    if (this.negativeTasks.length <= this.surveyOptions.maxOptOut) {
      // Remove from all tasks
      this.availableTasks.splice(this.lastAvailableTaskDraggedIndex, 1);
      this.filterList();

    } else {
      // If they have reached the max number of negative tasks don't allow any more to be added
      this.negativeTasks.splice(this.negativeTasks.findIndex(t => t === e.value), 1);
      this.filterList();


    }
  }


  filterList() {


    this.filteredList =  this.availableTasks.filter(val => val.taskName.toUpperCase().includes(this.availableTaskFilter.toUpperCase()));

  }

  getSurveyInfo(id: string) {

    this.http.getSurveyQuestions(id)
      .subscribe(
        (response) => {

          console.log(response);
          this.allTasks = response['tasks'];
          this.availableTasks = response['tasks'].slice();
          this.taskAlias = response['taskAlias'];
          this.agentAlias = response['agentAlias'];
          this.completed = response['completed'];
          this.surveyOptions = <SurveyOptions> response['surveyOptions'];


          this.taskAlias = !!this.taskAlias ? this.taskAlias : 'Task';
          this.agentAlias = !!this.agentAlias ? this.agentAlias : 'Agent';


          this.filterList();
        },
        (err) => this.error.handleError(err),
        () => console.dir('HTTP survey call finished')
      );
  }


}
