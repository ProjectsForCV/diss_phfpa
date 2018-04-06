import { Component, Input, OnInit } from '@angular/core';
import { Group } from '../Group';
import { Task } from '../../../../services/http/interfaces/Task';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.css']
})
export class NewGroupComponent implements OnInit {

  @Input()
  public group: Group;

  @Input()
  public tasks: Task[];
  public availableTasks: Task[];

  public selectedTask: Task;

  constructor() { }

  addTask() {
    this.group.tasks.push(this.selectedTask);
    this.availableTasks.splice(this.availableTasks.findIndex(val => val === this.selectedTask), 1);
  }
  remove(task) {
    this.group.tasks.splice(this.group.tasks.findIndex(val => val === task) , 1);
    this.availableTasks.push(task);
  }
  ngOnInit() {
    this.availableTasks = this.tasks.slice();
  }

}
