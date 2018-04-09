import { Component, OnInit } from '@angular/core';
import { GenerationOptions } from './GenerationOptions';

@Component({
  selector: 'app-generate-tasks-agents',
  templateUrl: './generate-tasks-agents.component.html',
  styleUrls: ['./generate-tasks-agents.component.css']
})
export class GenerateTasksAgentsComponent implements OnInit {

  public generationOptions: GenerationOptions;
  constructor() { }

  ngOnInit() {
  }

}
