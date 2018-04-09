import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base-service';
import { Agent } from './interfaces/Agent';

@Injectable()
export class HttpEmailService extends HttpBaseService {


  public sendSurveyLinksToAgents(agents: Agent[], taskAlias: string, agentAlias: string, organiserName: string) {

    const postObj = {
      agents: agents,
      taskAlias: taskAlias,
      agentAlias: agentAlias,
      organiserName: organiserName
    };
    return this.post('/email/agents', postObj);
  }

  public sendLandingPageLinkToOrganiser(organiserName: string, organiserEmail: string) {

  }
}
