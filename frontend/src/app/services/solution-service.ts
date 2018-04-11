import { Injectable } from '@angular/core';
import { AssignmentResults } from './http/interfaces/AssignmentResults';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SolutionService {

  public solutionPickedListener: BehaviorSubject<AssignmentResults[]> = new BehaviorSubject<AssignmentResults[]>([]);

  constructor() {

  }

  publishFoundSolution(assignment: AssignmentResults[]) {
    this.solutionPickedListener.next(assignment);
  }




}
