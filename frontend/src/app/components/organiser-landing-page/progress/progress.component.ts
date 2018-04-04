import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Agent } from '../../../services/http/interfaces/Agent';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit , OnChanges{
  @Input()
  public agents: Agent[];

  @Input()
  public agentAlias = 'Agent';

  @Output()
  public numberOfCompletedAgents: EventEmitter<number> = new EventEmitter<number>();

  public progressValue: number;
  private completed: number;

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.progressValue = this.calculateProgress();

  }

  private calculateProgress() {
    this.completed = this.agents.filter(agent => agent.completed).length;

    this.numberOfCompletedAgents.emit(this.completed);

    return Math.floor((this.completed / this.agents.length ) * 100);
  }
}
