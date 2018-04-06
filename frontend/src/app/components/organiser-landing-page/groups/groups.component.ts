import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Group } from './Group';
import { Task } from '../../../services/http/interfaces/Task';
@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {


  @Input()
  public tasks: Task[];

  @Input()
  public groups: Group[] = [];

  constructor() { }

  ngOnInit() {
  }

  public addGroup() {
    this.groups.push(<Group>{
      maxAssignments: 0,
      tasks: []
    });
  }

}
