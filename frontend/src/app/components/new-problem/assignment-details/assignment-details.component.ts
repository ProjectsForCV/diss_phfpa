import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UploadIconComponent } from '../upload-icon.component';

@Component({
  selector: 'app-assignment-details',
  templateUrl: './assignment-details.component.html',
  styleUrls: ['./assignment-details.component.css']
})
export class AssignmentDetailsComponent implements OnInit {

  public formGroup: FormGroup;

  @Output()
  public formState: EventEmitter<FormGroup> = new EventEmitter();

  @Output()
  public imageChange: EventEmitter<File> = new EventEmitter<File>();


  constructor(fb: FormBuilder) {
    this.formGroup = fb.group({
      'title' : ['', Validators.required],
      'name' : ['', Validators.required],
      'email' : ['', Validators.required]
    });
    this.formGroup.valueChanges.subscribe(
      () => {
        this.formState.emit(this.formGroup);
      }
    );
  }

  fileChanged(file: File) {
    this.imageChange.emit(file);
  }

  ngOnInit() {
  }

}
