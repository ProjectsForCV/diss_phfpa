import { Agent } from './Agent';

export interface NewAssignment {
  assignmentTitle: string;
  organiserName: string;
  organiserEmail: string;
  agents: Agent[];
  tasks: string[];
}
