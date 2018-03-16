import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AgentTaskMode } from './AgentTaskMode';
import { TaskAgentsComponent } from './task-agents/task-agents.component';
import { HttpAssignmentService } from '../../services/http/http-assignment-service';
import { Agent } from '../../services/http/interfaces/Agent';
import { NewAssignment } from '../../services/http/interfaces/NewAssignment';

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
  public continueButtonText = 'Continue';
  public page = 1;

  public assignmentDetailsFormState: FormGroup;
  public assignmentDetailsComplete = false;

  public agentDetailsComplete = false;


  private tasksComplete = false;
  constructor(public http: HttpAssignmentService) { }

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

  next() {
    if (this.page === 1) {
      this.agents = this.agentComponent.getAllStrings().map(s => {return {email: s}; });
      this.organiserEmail = this.assignmentDetailsFormState.get('email').value;
      this.organiserName = this.assignmentDetailsFormState.get('name').value;
      this.assignmentTitle = this.assignmentDetailsFormState.get('title').value;

    }
    if (this.page === 2) {
      this.tasks = this.taskComponent.getAllStrings();
    }
    this.page++;
    this.updatePageState();
  }

  back() {
    this.page--;
    this.updatePageState();
  }

  private updatePageState() {
    const page = this.page;

    if (page === 1 && this.agentDetailsComplete && this.assignmentDetailsComplete) {
      this.continueButtonVisible = true;
      this.continueButtonText = 'Continue';
      return;
    }

    if (page === 2 && this.taskComponent && this.tasksComplete) {
      this.continueButtonVisible = true;
      this.continueButtonText = 'Finish & Send Survey to Agents';
      return;
    }

    if (page === 3) {
      this.createAssignmentProblem();
    }


    this.continueButtonVisible = false;
  }

  private createAssignmentProblem() {
    const assignment: NewAssignment = {
      assignmentTitle: this.assignmentTitle,
      organiserEmail: this.organiserEmail,
      organiserName: this.organiserName,
      agents: this.agents,
      tasks: this.tasks
    };
    this.http.postNewAssignment(assignment)
      .subscribe(
        res => console.log(res),
              err => console.error(err),
        () => console.dir('Finished')
      );
  }
}
