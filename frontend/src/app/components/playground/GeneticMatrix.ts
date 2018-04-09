import { AssignmentResults } from '../../services/http/interfaces/AssignmentResults';

export interface GeneticMatrix {
  solution: number[][];
  totalCost: number;
  distance: number;
  assignment?: AssignmentResults[];
}
