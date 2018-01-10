import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Globals } from '../../components/Globals';

@Injectable()
export class HttpBaseService {

  public HOST_ENDPOINT;
  public MOCK_HOST = 'http://localhost:12345';
  public REAL_HOST;

  constructor(public http: Http) {
    this.HOST_ENDPOINT = Globals.RunMode === Globals.AppRunModeEnum.MOCK ? this.MOCK_HOST : this.REAL_HOST;
  }
  public get(resourcePath: string) : Observable<any>{
    return this.http.get(this.HOST_ENDPOINT + resourcePath);
  }

  public post(resourcePath: string, paylod: any): Observable<any> {
    return this.http.post(this.HOST_ENDPOINT + resourcePath, paylod);
  }
}
