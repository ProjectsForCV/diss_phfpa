import { GeneticOptions } from '../../services/http/interfaces/GeneticOptions';

export interface SolveOptions {
  algorithm: string;
  geneticOptions?: GeneticOptions;
}
