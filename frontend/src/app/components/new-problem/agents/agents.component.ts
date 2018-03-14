import { Component, OnInit, ViewChild } from '@angular/core';
import { UploadAgentsComponent } from './upload-agents/upload-agents.component';
import { EnterAgentsComponent } from './enter-agents/enter-agents.component';
import { HttpEmailService } from '../../../services/http/http-email-service';
@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})
export class AgentsComponent implements OnInit {

  @ViewChild(UploadAgentsComponent) uploadAgents: UploadAgentsComponent;
  @ViewChild(EnterAgentsComponent) enterAgents: EnterAgentsComponent;

  public allEmails: string[] = [];

  constructor() { }

  ngOnInit() {
  }


}
