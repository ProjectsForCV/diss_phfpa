import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AgentTaskMode } from '../AgentTaskMode';
import { UploadTaskAgentsComponent } from './upload-task-agents/upload-task-agents.component';
@Component({
  selector: 'app-task-agents',
  templateUrl: './task-agents.component.html',
  styleUrls: ['./task-agents.component.css']
})
export class TaskAgentsComponent implements OnInit {

  @Input()
  public mode: AgentTaskMode;

  @Output()
  public stringsChanged: EventEmitter<any> = new EventEmitter<any>();


  @ViewChild(UploadTaskAgentsComponent) uploadTaskAgents: UploadTaskAgentsComponent;

  @Input()
  public manualStrings: string[] = [];

  @Input()
  public csvUploadStrings: string[] = [];


  @Input()
  public csvFilename: string;


  public getAllStrings() {
    return this.manualStrings.concat(this.csvUploadStrings);
  }
  constructor() { }

  getManualEntryHelptext() {
    return this.mode === AgentTaskMode.TASK ? 'Enter task details manually.' : 'Enter agent email addresses manually';
  }

  getCsvHelptext() {
    return this.mode === AgentTaskMode.TASK ? 'Upload a CSV containing task names.' : 'Upload a CSV containing agent email addresses.';
  }
  manualStringsChanged(strings: string[]) {
    this.manualStrings = strings;
    this.stringsChanged.emit( {strings: this.manualStrings, mode: this.mode});
  }

  csvUploadStringsChanged(csvStrings: string[]) {
    this.csvUploadStrings = csvStrings;
    this.stringsChanged.emit({strings: this.csvUploadStrings, mode: this.mode });
  }

  csvFilenameChangedEvent(name: string) {
    this.csvFilename = name;
  }

  ngOnInit() {

  }


}
