import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AgentTaskMode } from './AgentTaskMode';
import { TaskAgentsComponent } from './task-agents/task-agents.component';
import { HttpAssignmentService } from '../../services/http/http-assignment-service';
import { Agent } from '../../services/http/interfaces/Agent';
import { Assignment } from '../../services/http/interfaces/Assignment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.css']
})
export class NewProblemComponent implements OnInit {

  @ViewChild('task') taskComponent: TaskAgentsComponent;
  @ViewChild('agent') agentComponent: TaskAgentsComponent;

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

  constructor(public http: HttpAssignmentService,
              public modal: BsModalService,
              public router: Router
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
      }

    }

    this.updatePageState();
  }


  ngOnInit() {
  }

  next(modalRef) {
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
      this.confirmFinishModalRef = this.modal.show(modalRef);
      return;

    }
    this.page++;
    this.updatePageState();
  }

  finish() {
    this.confirmFinishModalRef.hide();
    this.tasks = this.taskComponent.getAllStrings();
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
      this.continueButtonText = 'Next';
      return;
    }

    if (page === 2 && this.agentDetailsComplete) {
      this.continueButtonVisible = true;
      this.continueButtonText = 'Next';
      return;
    }

    if (page === 3 && this.taskComponent && this.tasksComplete) {
      this.continueButtonVisible = true;
      this.continueButtonText = 'Finish';
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
      taskAlias: this.taskComponent.getAlias()
    };
    this.http.postNewAssignment(assignment)
      .subscribe(
        res => this.problemCreated(res),
              err => console.error(err),
        () => console.dir('Finished')
      );
  }

  private problemCreated(res: Response) {
    const problemID = res.json()['problemId'];
    this.router.navigate(['/assignment', problemID] );
  }
}
