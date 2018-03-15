import { Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormGroup } from '@angular/forms';
import { AgentTaskMode } from './AgentTaskMode';
import { TaskAgentsComponent } from './task-agents/task-agents.component';

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

  public manualTasks: string[] = [];
  public csvTasks: string[] = [];
  public csvTaskFilename = 'No File chosen';

  public agentMode = AgentTaskMode.AGENT;
  public taskMode = AgentTaskMode.TASK;

  public continueButtonVisible = false;
  public page = 1;

  public assignmentDetailsFormState: FormGroup;
  public assignmentDetailsComplete = false;

  public agentDetailsComplete = false;


  private tasksComplete = false;
  constructor() { }

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
      if (!data.strings || data.strings.length === 0){
        this.agentDetailsComplete = false;
        return;
      }

      this.agentDetailsComplete = true;

      // Store manual emails
      this.manualEmails = this.agentComponent.manualStrings;

      // Store csv emails
      this.csvEmails = this.agentComponent.csvUploadStrings;

      // Store csv filename
      this.csvEmailsFilename = this.agentComponent.csvFilename;
    }

    if (data.mode === AgentTaskMode.TASK) {
      if (!data.strings || data.strings.length === 0) {
        this.tasksComplete = false;
        return;
      }
      this.tasksComplete = true;

      // Store manual tasks
      this.manualTasks = this.taskComponent.manualStrings;

      // Store csv tasks
      this.csvTasks = this.taskComponent.csvUploadStrings;

      // Store csv task filename
      this.csvTaskFilename = this.taskComponent.csvFilename;
    }


    this.updatePageState();
  }


  ngOnInit() {
  }

  next() {
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
      return;
    }

    this.continueButtonVisible = false;
  }
}
