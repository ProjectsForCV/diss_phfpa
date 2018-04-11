import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base-service';
import { Agent } from './interfaces/Agent';
import { GeneticOptions } from './interfaces/GeneticOptions';

@Injectable()
export class HttpCostMatrixService extends HttpBaseService {


  public getRandomMatrix(rows: number, cols: number) {
    return this.get('/costMatrix/randomMat/' + rows + '/' + cols);
  }

  public postSolveMatrix(matrix: number[][], geneticOptions?: GeneticOptions, rownames?: string[], colnames?: string[]) {
    const postObject = {
      matrix: matrix,
      geneticOptions: geneticOptions,
      rownames: rownames,
      colnames: colnames
    };
    return this.post('/costMatrix/solveMat' , postObject);
  }

  public postSolveAssignmentProblem(assignmentId: string, completedAgents: Agent[], geneticOptions?: GeneticOptions) {
    const postObject = {
      problemId: assignmentId,
      agents: completedAgents,
      geneticOptions: geneticOptions
    };
    return this.post('/costMatrix/solveProblem', postObject );
  }
}
