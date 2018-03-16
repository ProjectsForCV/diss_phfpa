import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base-service';
import { Headers, RequestOptions } from '@angular/http';
import { NewAssignment } from './interfaces/NewAssignment';

@Injectable()
export class HttpAssignmentService extends HttpBaseService {

  public postNewAssignment(assignmentDetails: NewAssignment) {

    const headers = new Headers();


    headers.append('Accept', 'application/json');
    // headers.append('Content-Type', 'multipart/form-data');
    const options = new RequestOptions({ headers: headers });

    return this.post('/assignment', assignmentDetails, options);
  }


}
