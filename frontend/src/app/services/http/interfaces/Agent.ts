import { SurveyAnswer } from './SurveyAnswer';

export interface Agent {
  email: string;
  agentId?: string;
  surveyID?: string;
  completed?: boolean;
  answers?: SurveyAnswer[];
}
