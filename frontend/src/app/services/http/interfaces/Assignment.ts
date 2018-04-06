import { Agent } from './Agent';
import { SurveyOptions } from './SurveyOptions';

export interface Assignment {
  assignmentTitle: string;
  organiserName: string;
  organiserEmail: string;
  agents: Agent[];
  tasks: string[];

  agentAlias: string;
  taskAlias: string;

  surveyOptions: SurveyOptions;
  finished?: boolean;
}
