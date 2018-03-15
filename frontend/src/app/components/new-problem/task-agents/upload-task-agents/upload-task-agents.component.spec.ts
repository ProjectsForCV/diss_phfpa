/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UploadTaskAgentsComponent } from './upload-task-agents.component';

describe('UploadTaskAgentsComponent', () => {
  let component: UploadTaskAgentsComponent;
  let fixture: ComponentFixture<UploadTaskAgentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadTaskAgentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadTaskAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
