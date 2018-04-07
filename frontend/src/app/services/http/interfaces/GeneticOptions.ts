import { Group } from '../../../components/organiser-landing-page/groups/Group';

export interface GeneticOptions {
  maxGenerations: number;
  mutationChance: number;
  returnedCandidates: number;
  populationSize: number;

  distanceThreshold: number;

  groups: Group[];
}
