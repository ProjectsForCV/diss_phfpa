import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base-service';
import { Headers, RequestOptions } from '@angular/http';

@Injectable()
export class HttpCSVService extends HttpBaseService {

  public postCheckEmailCSVFormat(csv) {
    const formData: FormData = new FormData();
    formData.append('csv', csv, csv.name);
    const headers = new Headers();


    headers.append('Accept', 'application/json');
    // headers.append('Content-Type', 'multipart/form-data');
    const options = new RequestOptions({ headers: headers });

    return this.post('/csv/parseEmail', formData, options);
  }

  public postCheckTaskCSVFormat(csv) {
    const formData: FormData = new FormData();
    formData.append('csv', csv, csv.name);
    const headers = new Headers();


    headers.append('Accept', 'application/json');
    // headers.append('Content-Type', 'multipart/form-data');
    const options = new RequestOptions({ headers: headers });

    return this.post('/csv/parseTask', formData, options);
  }

  public postCostMatrixCSV (csv) {

    const formData: FormData = new FormData();
    formData.append('csv', csv, csv.name);
    const headers = new Headers();


    headers.append('Accept', 'application/json');
    // headers.append('Content-Type', 'multipart/form-data');
    const options = new RequestOptions({ headers: headers });

    return this.post('/csv/costMatrix', formData, options);
  }
}
