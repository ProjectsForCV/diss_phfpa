import { Component, Input, OnInit } from '@angular/core';
import { SolveOptions } from '../../../playground/SolveOptions';

@Component({
  selector: 'app-algorithm-select',
  templateUrl: './algorithm-select.component.html',
  styleUrls: ['./algorithm-select.component.css']
})
export class AlgorithmSelectComponent implements OnInit {

  @Input()
  public options: SolveOptions;

  @Input()
  public disabled: boolean;

  constructor() { }

  ngOnInit() {
  }

}
