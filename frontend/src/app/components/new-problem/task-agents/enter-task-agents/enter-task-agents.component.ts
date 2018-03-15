import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AgentTaskMode } from '../../AgentTaskMode';

@Component({
  selector: 'app-enter-task-agents',
  templateUrl: './enter-task-agents.component.html',
  styleUrls: ['./enter-task-agents.component.css']
})
export class EnterTaskAgentsComponent implements OnInit {

  @Input()
  public mode: AgentTaskMode;

  @Input()
  public strings: string[] = [];

  public currentEmailInput: FormControl = new FormControl('');
  public currentEmailDomainInput: FormControl = new FormControl('');

  public currentTaskInput: FormControl = new FormControl();

  @Output()
  public stringsChanged: EventEmitter<string[]> = new EventEmitter<string[]>();


  constructor() { }

  isAgentMode() {
    return this.mode === AgentTaskMode.AGENT;
  }

  getPanelHeading() {
    return this.mode === AgentTaskMode.TASK ? 'Task Names' : 'Agent Emails';
  }
  addEmail() {

    if (this.currentEmailInput.value && this.currentEmailInput.value !== '') {
      this.strings.push(this.currentEmailInput.value + '@' + this.currentEmailDomainInput.value);

      // Reset value after user inputs
      this.currentEmailInput.reset();

      // Update parent
      this.stringsChanged.emit(this.strings);
    }
  }

  addTask() {
    if (this.currentTaskInput.value && this.currentTaskInput.value !== '') {

      this.strings.push(this.currentTaskInput.value);

      // Reset value after user inputs
      this.currentTaskInput.reset();

      // Update parent
      this.stringsChanged.emit(this.strings);
    }
  }

  removeString(index) {

    this.strings.splice(index, 1);

    // Update parent
    this.stringsChanged.emit(this.strings);
  }


  ngOnInit() {
  }

}
