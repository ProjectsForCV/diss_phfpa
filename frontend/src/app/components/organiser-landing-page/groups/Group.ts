import { Task } from '../../../services/http/interfaces/Task';

export interface Group {
  tasks: Task[];
  maxAssignments: number;
}
