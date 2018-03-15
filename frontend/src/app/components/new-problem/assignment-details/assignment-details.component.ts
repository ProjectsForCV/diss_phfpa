import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-assignment-details',
  templateUrl: './assignment-details.component.html',
  styleUrls: ['./assignment-details.component.css']
})
export class AssignmentDetailsComponent implements OnInit {

  public formGroup: FormGroup;

  @Output()
  public formState: EventEmitter<FormGroup> = new EventEmitter();

  constructor(fb: FormBuilder) {
    this.formGroup = fb.group({
      'title' : ['', Validators.required],
      'name' : ['', Validators.required],
      'email' : ['', Validators.required]
    });
    this.formGroup.valueChanges.subscribe(
      () => this.formState.emit(this.formGroup)
    );



  }

  ngOnInit() {
  }

}
