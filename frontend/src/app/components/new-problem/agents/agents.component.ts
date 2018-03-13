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

  constructor(public http: HttpEmailService) { }

  ngOnInit() {
  }

  next() {
    const manuallyEnteredEmails = this.enterAgents.getEmails();
    const csvEmails = this.uploadAgents.getFile();

    // IF CSV is present, post to server and check if the CSV is of the correct format
    if (csvEmails) {
      this.http.postCheckCSVFormat(csvEmails);
    }
  }






}
