import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpEmailService } from '../../../../services/http/http-email-service';


@Component({
  selector: 'app-upload-agents',
  templateUrl: './upload-agents.component.html',
  styleUrls: ['./upload-agents.component.css'],
  providers: [HttpEmailService]
})
export class UploadAgentsComponent implements OnInit {

  private _fileList: FileList;

  public fileName = 'No file chosen';
  public emailList: string[];
  constructor(public http: HttpEmailService) { }

  ngOnInit() {
  }

  public getFile() {
    return this._fileList[0];
  }

  fileChanged(fileEvent) {
    if (fileEvent.target.files && fileEvent.target.files.length > 0) {
      this._fileList = fileEvent.target.files;
      this.fileName = this.getFile().name;
    }

  }

  upload() {
    const csvEmails = this.getFile();

    // IF CSV is present, post to server and check if the CSV is of the correct format
    if (csvEmails) {
      this.http.postCheckCSVFormat(csvEmails)
        .subscribe(
          res => this.handleResponse(res),
          err => console.error(err),
          () => console.dir('Finished')
        );
    }
  }

  handleResponse(response) {
    const json = response.json();
    const emails = json['emails'];

    this.buildEmailList(emails);
  }

  getDisplayTitle() {
    return `Emails in ${this.fileName}`;
  }

  buildEmailList(emails: string[]) {

    this.emailList = emails;
  }

}
