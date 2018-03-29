import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base-service';
import { Headers, RequestOptions } from '@angular/http';
import { Assignment } from './interfaces/Assignment';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class HttpAssignmentService extends HttpBaseService {

  public postNewAssignment(assignmentDetails: Assignment) {

    const headers = new Headers();

    headers.append('Accept', 'application/json');
    // headers.append('Content-Type', 'multipart/form-data');
    const options = new RequestOptions({ headers: headers });

    return this.post('/assignment', assignmentDetails, options);
  }

  public getAssignmentInfo(assignmentId: string) {

    const options = assignmentId ?
      { params: new HttpParams().set('assignmentId', assignmentId)} : {};

    return this.get('/assignment/', options);
  }

  public getSurveyInfo(surveyId: string) {

  }


}
