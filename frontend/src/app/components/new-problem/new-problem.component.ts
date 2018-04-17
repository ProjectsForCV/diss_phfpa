import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AgentTaskMode } from './AgentTaskMode';
import { TaskAgentsComponent } from './task-agents/task-agents.component';
import { HttpAssignmentService } from '../../services/http/http-assignment-service';
import { Agent } from '../../services/http/interfaces/Agent';
import { Assignment } from '../../services/http/interfaces/Assignment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { SurveyOptionsComponent } from '../survey-options/survey-options.component';
import { SurveyOptions } from '../../services/http/interfaces/SurveyOptions';
import { HttpEmailService } from '../../services/http/http-email-service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.css']
})
export class NewProblemComponent implements OnInit {

  @ViewChild('task') taskComponent: TaskAgentsComponent;
  @ViewChild('agent') agentComponent: TaskAgentsComponent;
  @ViewChild('surveyOptions') surveyOptionsComponent: SurveyOptionsComponent;

  public manualEmails: string[] = [];
  public csvEmails: string[] = [];
  public csvEmailsFilename = 'No File chosen';

  public organiserName: string;
  public organiserEmail: string;
  public assignmentTitle: string;

  public agents: Agent[] = [];
  public tasks: string[] = [];

  public manualTasks: string[] = [];
  public csvTasks: string[] = [];
  public csvTaskFilename = 'No File chosen';

  public agentMode = AgentTaskMode.AGENT;
  public taskMode = AgentTaskMode.TASK;

  public continueButtonVisible = false;
  public continueButtonText = 'Next';
  public page = 1;

  public assignmentDetailsFormState: FormGroup;
  public assignmentDetailsComplete = false;

  public agentDetailsComplete = false;


  private tasksComplete = false;
  private confirmFinishModalRef: any;
  private agentAlias: string;
  private taskAlias: string;

  public surveyOptions: SurveyOptions;
  public emailSubscription: Subscription;
  public base64ImageString: string;
  public creatingAssignment: Subscription;

  constructor(public http: HttpAssignmentService,
              public modal: BsModalService,
              public router: Router,
              public httpEmail: HttpEmailService
  ) { }

  assignmentDetailsChanged(form: FormGroup) {
    this.assignmentDetailsFormState = form;

    if (this.assignmentDetailsFormState.valid) {
      this.assignmentDetailsComplete = true;
    } else {
      this.assignmentDetailsComplete = false;
    }

    this.updatePageState();

  }

  problemImageChanged(file: string) {
    this.base64ImageString = file;
  }


  taskAgentChanged(data: any) {



    if (data.mode === AgentTaskMode.AGENT) {
      if (!data.strings || data.strings.length === 0) {
        this.agentDetailsComplete = false;

      } else {
        this.agentDetailsComplete = true;

        // Store manual emails
        this.manualEmails = this.agentComponent.manualStrings;

        // Store csv emails
        this.csvEmails = this.agentComponent.csvUploadStrings;

        // Store csv filename
        this.csvEmailsFilename = this.agentComponent.csvFilename;
      }


    }

    if (data.mode === AgentTaskMode.TASK) {

      if (!data.strings || data.strings.length === 0) {
        this.tasksComplete = false;

      } else {
        this.tasksComplete = true;

        // Store manual tasks
        this.manualTasks = this.taskComponent.manualStrings;

        // Store csv tasks
        this.csvTasks = this.taskComponent.csvUploadStrings;

        // Store csv task filename
        this.csvTaskFilename = this.taskComponent.csvFilename;

        this.tasks = this.manualTasks.concat(this.csvTasks);
      }

    }

    this.updatePageState();
  }


  ngOnInit() {
  }

  next(modalRef) {
    window.scroll(0, 0);
    if (this.page === 1) {

      this.organiserEmail = this.assignmentDetailsFormState.get('email').value;
      this.organiserName = this.assignmentDetailsFormState.get('name').value;
      this.assignmentTitle = this.assignmentDetailsFormState.get('title').value;

    }
    if (this.page === 2) {
      this.agentAlias = this.agentComponent.getAlias();
      this.agents = this.agentComponent.getAllStrings().map(s => {return {email: s}; });
    }

    if (this.page === 3) {
      this.tasks = this.taskComponent.getAllStrings();
      this.taskAlias = this.taskComponent.getAlias();
    }
    if (this.page === 4) {
      this.surveyOptions = this.surveyOptionsComponent.getSurveyOptions();
      this.confirmFinishModalRef = this.modal.show(modalRef);
      return;

    }
    this.page++;
    this.updatePageState();
  }

  finish() {
    this.confirmFinishModalRef.hide();
    this.createAssignmentProblem();
  }

  back() {
    this.page--;
    this.updatePageState();
  }

  private updatePageState() {
    const page = this.page;

    if (page === 1 && this.assignmentDetailsComplete) {
      this.continueButtonVisible = true;
      this.continueButtonText = 'NEXT';
      return;
    }

    if (page === 2 && this.agentDetailsComplete) {
      this.continueButtonVisible = true;
      this.continueButtonText = 'NEXT';
      return;
    }


    if (page === 3 &&  this.tasks.length > 0) {


      this.continueButtonVisible = true;
      this.continueButtonText = 'NEXT';
      return;
    }



    if (page === 4) {
      this.continueButtonVisible = true;
      this.continueButtonText = 'FINISH';
      return;
    }



    this.continueButtonVisible = false;
  }

  private createAssignmentProblem() {
    const assignment: Assignment = {
      assignmentTitle: this.assignmentTitle,
      organiserEmail: this.organiserEmail,
      organiserName: this.organiserName,
      agents: this.agents,
      tasks: this.tasks,
      agentAlias: this.agentAlias,
      taskAlias: this.taskAlias,
      surveyOptions: this.surveyOptions,
      image: this.base64ImageString
    };

    this.creatingAssignment = this.http.postNewAssignment(assignment)
      .subscribe(
        res => this.problemCreated(res),
              err => console.error(err),
        () => console.dir('Finished')
      );
  }

  private problemCreated(res: Response) {

    this.emailSubscription = this.httpEmail.sendSurveyLinksToAgents(res['problemId'])
      .subscribe(
        (emailResponse: Response) => {
          console.log(emailResponse);
          this.emailSubscription.unsubscribe();
        }
      );

    const orgSub = this.httpEmail.sendLandingPageLinkToOrganiser(res['problemId'])
      .subscribe(
        (emailResponse: Response) => {
          console.log(res);
          orgSub.unsubscribe();
        }
      );
    const problemID = res['problemId'];
    this.router.navigate(['/assignment', problemID] );
  }
}
