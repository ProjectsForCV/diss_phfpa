import { Component, Input, OnInit } from '@angular/core';
import { GeneticOptions } from '../../../../services/http/interfaces/GeneticOptions';
import { Task } from '../../../../services/http/interfaces/Task';

@Component({
  selector: 'app-genetic-options',
  templateUrl: './genetic-options.component.html',
  styleUrls: ['./genetic-options.component.css']
})
export class GeneticOptionsComponent implements OnInit {

  @Input()
  public geneticOptions: GeneticOptions;

  @Input()
  public tasks: Task[];
  constructor() { }

  ngOnInit() {
  }

}
