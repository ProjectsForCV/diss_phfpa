import { Agent } from './Agent';
import { Task } from './Task';

export interface AssignmentResults {
  agent: Agent;
  task: Task;
  cost: number;
}
