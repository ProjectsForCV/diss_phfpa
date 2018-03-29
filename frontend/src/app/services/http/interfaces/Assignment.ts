import { Agent } from './Agent';

export interface Assignment {
  assignmentTitle: string;
  organiserName: string;
  organiserEmail: string;
  agents: Agent[];
  tasks: string[];

  agentAlias: string;
  taskAlias: string;

  completed?: boolean;
}
