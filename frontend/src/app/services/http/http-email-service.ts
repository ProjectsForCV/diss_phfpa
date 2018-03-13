import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base-service';

@Injectable()
export class HttpEmailService extends HttpBaseService{

  public postCheckCSVFormat(csv){
    return this.post('/checkCSV', csv);
  }
}
