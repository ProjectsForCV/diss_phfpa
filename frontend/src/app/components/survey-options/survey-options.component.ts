import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SurveyOptions } from '../../services/http/interfaces/SurveyOptions';

@Component({
  selector: 'app-survey-options',
  templateUrl: './survey-options.component.html',
  styleUrls: ['./survey-options.component.css']
})
export class SurveyOptionsComponent implements OnInit {

  public optOut = false;
  public optOutMax = '';
  public selectedMax = '';
  public message = '';

  public complete = true;

  @Output()
  public detailsChanged: EventEmitter<any> = new EventEmitter();

  public getSurveyOptions() : SurveyOptions {
    return <SurveyOptions>{
      maxSelection: parseInt(this.selectedMax, 10),
      message: this.message,
      allowOptOut: this.optOut,
      maxOptOut: parseInt(this.optOutMax, 10)
    };
  }
  constructor() { }

  ngOnInit() {
  }

  optOutChanged() {

    if (this.optOut) {
      this.complete = false;
    } else {
      this.complete = true;
    }

    this.detailsChanged.emit();
  }

  optOutMaxChanged() {

    if (this.optOutMax.length > 0) {
      this.complete = true;
    } else {
      this.complete = false;
    }

    this.detailsChanged.emit();
  }

}
