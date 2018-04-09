
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Globals } from '../../components/Globals';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpBaseService {

  public HOST_ENDPOINT;
  public MOCK_HOST = 'http://localhost:12345/api';
  public REAL_HOST = 'https://munkres.ml/api';

  constructor(public http: HttpClient) {
    this.HOST_ENDPOINT = Globals.RunMode === Globals.AppRunModeEnum.MOCK ? this.MOCK_HOST : this.REAL_HOST;
  }
  public get(resourcePath: string, options?: any): Observable<any> {


    return this.http.get(this.HOST_ENDPOINT + resourcePath, options);

  }

  public post(resourcePath: string, paylod: any, options?: any): Observable<any> {
    console.log(paylod);

    return this.http.post(this.HOST_ENDPOINT + resourcePath, paylod, options);
  }

  public getHost() {
    return this.HOST_ENDPOINT;
  }
}
