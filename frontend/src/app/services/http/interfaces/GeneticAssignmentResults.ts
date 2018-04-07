import { AssignmentResults } from './AssignmentResults';

export interface GeneticAssignmentResults {
  assignment: AssignmentResults[];
  totalCost: number;

  distance: number;
}
