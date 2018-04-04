import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent implements OnInit {

  @Input()
  public surveysComplete = false;
  constructor() { }

  ngOnInit() {
  }

}
