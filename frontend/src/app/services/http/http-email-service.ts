import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base-service';
import { Agent } from './interfaces/Agent';

@Injectable()
export class HttpEmailService extends HttpBaseService {


  public sendSurveyLinksToAgents(agents: Agent[]) {
    debugger;
    return this.post('/email', agents);
  }
}
