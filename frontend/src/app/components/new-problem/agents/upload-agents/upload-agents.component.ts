import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-upload-agents',
  templateUrl: './upload-agents.component.html',
  styleUrls: ['./upload-agents.component.css']
})
export class UploadAgentsComponent implements OnInit {



  public fileUpload: FormControl = new FormControl('');

  private _fileList: FileList;
  constructor() { }

  ngOnInit() {
  }

  // TODO : Allow for multiple CSV upload perhaps
  public getFile() {
    return this._fileList[0];
  }

  fileChanged(fileEvent) {
    if (fileEvent.target.files && fileEvent.target.files.length > 0) {
      this._fileList = fileEvent.target.files;
    }

  }

}
