import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base-service';
import { Agent } from './interfaces/Agent';

@Injectable()
export class HttpEmailService extends HttpBaseService {


  public sendSurveyLinksToAgents(assignmentId: string) {

    const postObj = {
      assignmentId: assignmentId
    };
    return this.post('/email/agents/sendSurveys', postObj);
  }

  public sendResultsToAgents(assignmentId: string) {

    const postObj = {
      assignmentId: assignmentId
    };
    return this.post('/email/agents/sendResults', postObj);
  }

  public sendLandingPageLinkToOrganiser(assignmentId: string) {
    const postObj = {
      assignmentId: assignmentId
    };
    return this.post('/email/organiser/landingPage', postObj);

  }
}
