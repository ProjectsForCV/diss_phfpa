import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base-service';
import { Headers, RequestOptions } from '@angular/http';

@Injectable()
export class HttpEmailService extends HttpBaseService{

  public postCheckCSVFormat(csv) {
    const formData: FormData = new FormData();
    formData.append('csv', csv, csv.name);
    const headers = new Headers();


    headers.append('Accept', 'application/json');
    // headers.append('Content-Type', 'multipart/form-data');
    const options = new RequestOptions({ headers: headers });

    return this.post('/email/checkCSV', formData, options);
  }
}
