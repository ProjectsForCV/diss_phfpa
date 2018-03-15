import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-scroll-display',
  templateUrl: './scroll-display.component.html',
  styleUrls: ['./scroll-display.component.css']
})
export class ScrollDisplayComponent implements OnInit {

  @Input()
  public inputStrings: string[] = [];

  @Input()
  public title = 'Results';

  constructor() { }

  ngOnInit() {
  }

}
