import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base-service';
import { Headers, RequestOptions } from '@angular/http';
import { Assignment } from './interfaces/Assignment';
import { HttpParams } from '@angular/common/http';
import { AssignmentResults } from './interfaces/AssignmentResults';

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

  public getAssignmentResults(assignmentId: string) {
    const options = assignmentId ?
      { params: new HttpParams().set('assignmentId', assignmentId)} : {};

    return this.get('/assignment/results', options);
  }

  public postFinishAssignment(solution: AssignmentResults[], assignmentId: string) {
    const postObj = {
      solution: solution,
      assignmentId: assignmentId
    };

    return this.post('/assignment/finish', postObj);
  }



}
