import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-icon',
  templateUrl: './upload-icon.component.html',
  styleUrls: ['./upload-icon.component.css']
})
export class UploadIconComponent implements OnInit {

  private _fileList: FileList;
  public fileName: string;
  public imageSrc = 'url(https://digital-public-contact.s3.amazonaws.com/production-thamesvalley/static/img/placeholder.png)';
  constructor() { }

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

}
