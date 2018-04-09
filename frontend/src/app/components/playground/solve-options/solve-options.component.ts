import { Component, Input, OnInit } from '@angular/core';

import { Task } from '../../../services/http/interfaces/Task';
import { SolveOptions } from '../SolveOptions';


@Component({
  selector: 'app-solve-options',
  templateUrl: './solve-options.component.html',
  styleUrls: ['./solve-options.component.css']
})
export class SolveOptionsComponent implements OnInit {

  @Input()
  public options: SolveOptions;

  @Input()
  public matrix: number[][];

  public tasks: Task[];

  createTasks() {
    this.tasks = this.matrix[0].map((val, index) => {
      return <Task>{
        taskName: `Task ${index + 1}`,
        taskId: '' + index
      };
    });
  }
  constructor() { }

  ngOnInit() {
    this.createTasks();
  }

}
