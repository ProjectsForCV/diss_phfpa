import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpCSVService } from '../../../../services/http/http-csv-service';
import { AlertService } from '../../../../services/alert-service/alert-service';
import { ErrorHandlingService } from '../../../../services/error-handling-service/error-handling-service';
import { AgentTaskMode } from '../../AgentTaskMode';


@Component({
  selector: 'app-upload-task-agents',
  templateUrl: './upload-task-agents.component.html',
  styleUrls: ['./upload-task-agents.component.css'],
  providers: [HttpCSVService]
})
export class UploadTaskAgentsComponent implements OnInit {

  @Input()
  public mode: AgentTaskMode;

  @Output()
  public stringsChanged: EventEmitter<string[]> = new EventEmitter();

  @Output()
  public filenameChanged: EventEmitter<string> = new EventEmitter<string>();

  private _fileList: FileList;

  @Input()
  public fileName = 'No file chosen';

  @Input()
  public strings: string[] = [];



  constructor(public http: HttpCSVService, public alertService: AlertService, public errorService: ErrorHandlingService) { }

  ngOnInit() {
  }

  public getFile() {
    return this._fileList[0];
  }

  fileChanged(fileEvent) {
    if (fileEvent.target.files && fileEvent.target.files.length > 0) {
      this._fileList = fileEvent.target.files;
      this.fileName = this.getFile().name;
      this.filenameChanged.emit(this.fileName);
    }

  }

  upload() {
    const csv = this.getFile();

    // IF CSV is present, post to server and check if the CSV is of the correct format
    if (csv && this.mode === AgentTaskMode.AGENT) {
      this.http.postCheckEmailCSVFormat(csv)
        .subscribe(
          res => this.handleResponse(res),
          err => {
            this.errorService.handleError(err);
          },
          () => console.dir('Finished')
        );
    }
    if (csv && this.mode === AgentTaskMode.TASK) {
      this.http.postCheckTaskCSVFormat(csv)
        .subscribe(
          res => this.handleResponse(res),
          err => this.errorService.handleError(err)
        );
    }
  }

  handleResponse(response) {

    const json = response;
    if (this.mode === AgentTaskMode.AGENT) {
      const emails = json['emails'];
      this.buildStringList(emails);
      if (json['emailsRemoved']) {
        this.alertService.error('Some emails have been removed due to length constraints.');
      }
    }
    if (this.mode === AgentTaskMode.TASK) {
      const tasks = json['tasks'];
      this.buildStringList(tasks);
      if (json['tasksRemoved']) {
        this.alertService.error('Some tasks have been removed due to length constraints.');
      }

    }
  }

  getDisplayTitle() {
    return `${this.mode === AgentTaskMode.AGENT ? 'Emails' : 'Tasks'} in ${this.fileName}`;
  }

  buildStringList(strings: string[]) {

    this.strings = strings;
    this.stringsChanged.emit((strings));
  }





}
