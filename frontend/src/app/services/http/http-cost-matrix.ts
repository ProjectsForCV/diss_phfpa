import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base-service';

@Injectable()
export class HttpCostMatrixService extends HttpBaseService{


  public getRandomMatrix(rows: number, cols: number) {
    return this.get('/costMatrix/randomMat/' + rows + '/' + cols);
  }

  public postSolveMatrix(matrix: number[][]) {
    return this.post('/costMatrix/solveMat' , matrix);
  }
}
