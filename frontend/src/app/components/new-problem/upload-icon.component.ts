import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';


@Component({
  selector: 'app-upload-icon',
  templateUrl: './upload-icon.component.html',
  styleUrls: ['./upload-icon.component.css']
})
export class UploadIconComponent implements OnInit {

  private _fileList: FileList;
  public fileName: string;
  public imageSrc: SafeStyle;

  public imageData: string;

  @Output()
  public imageChanged: EventEmitter<string> = new EventEmitter<string>();
  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.imageSrc = this.sanitizer.
    bypassSecurityTrustStyle('url(https://digital-public-contact.s3.amazonaws.com/production-thamesvalley/static/img/placeholder.png)');

  }

  public getFile() {
    return this._fileList[0];
  }



  fileChanged(fileEvent) {
    if (fileEvent.target.files && fileEvent.target.files.length > 0) {
      this._fileList = fileEvent.target.files;
      this.fileName = this.getFile().name;

      const reader = new FileReader();
      Observable.fromEvent(reader, 'load')
        .subscribe(res => {
          const safe = this.sanitizer.bypassSecurityTrustStyle(`url(${reader.result})`);
          this.imageSrc = safe;
          this.imageChanged.emit(reader.result);
        });
      reader.readAsDataURL(this.getFile());
    }

  }

}
