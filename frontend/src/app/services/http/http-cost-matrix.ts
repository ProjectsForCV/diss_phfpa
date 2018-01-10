import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base-service';

@Injectable()
export class HttpCostMatrixService extends HttpBaseService{


  public getRandomMatrix() {
    return this.get('/randomMat');
  }
}
