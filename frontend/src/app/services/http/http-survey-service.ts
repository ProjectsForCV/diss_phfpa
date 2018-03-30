import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base-service';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class HttpSurveyService extends HttpBaseService {

  public postSurveyAnswers() {

    const headers = new HttpHeaders();

    headers.append('Accept', 'application/json');
    // headers.append('Content-Type', 'multipart/form-data');
    const options = { headers: headers };

    return false;
  }

  public getSurveyQuestions(surveyID: string) {

    const options = surveyID ?
      { params: new HttpParams().set('surveyId', surveyID)} : {};

    return this.get('/survey/questions/', options);
  }




}
