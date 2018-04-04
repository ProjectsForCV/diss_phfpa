import { Component, Input, OnInit } from '@angular/core';
import { Assignment } from '../../../services/http/interfaces/Assignment';
import { SurveyAnswer } from '../../../services/http/interfaces/SurveyAnswer';
@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  @Input()
  public assignment: Assignment;

  public mostPopularTask: SurveyAnswer;

  public firstChoiceTasks: SurveyAnswer[];
  public firstChoiceTasksGraphData : any;
  private leastPopularTask: SurveyAnswer;

  constructor() { }

  getMostPopularTask(): SurveyAnswer {
    const answers: SurveyAnswer[][] = this.assignment.agents.map(agent => agent.answers);


    // Get a list of all the tasks that have been chosen as first choices
    const mostPopularTasks = answers.map(popular => {
      return popular.filter(answer => answer.cost === 1)[0];
    });

    this.firstChoiceTasks = mostPopularTasks;


    return this.mode(mostPopularTasks);

  }

  getLeastPopularTask(): SurveyAnswer {
    const answers: SurveyAnswer[][] = this.assignment.agents.map(agent => agent.answers);


    // Get a list of all the tasks that have been chosen as first choices
    const leastPopularTasks = answers.map(popular => {
      return popular.filter(answer => answer.cost > this.assignment.surveyOptions.maxSelection)[0];
    });

    // DCOOKE 04/04/2018 - TODO: Fix this 

    return leastPopularTasks[0];
  }

  tallyTasks(taskList: SurveyAnswer[], cost: number): TaskTally[] {
    const tally: TaskTally[] = [];

    for (let i = 0; i < taskList.length; i ++) {

      if (taskList[i].cost !== cost) {
        continue;
      }

      const tallyIndex = tally.findIndex((taskTally) => taskTally.taskId === taskList[i].taskId);

      if (tallyIndex >= 0) {
        // Increase the tally
        tally[tallyIndex].tally ++;
      } else {
        tally.push(<TaskTally>{
          taskId: taskList[i].taskId,
          taskName: taskList[i].taskName,
          tally: 1
        });
      }
    }

    return tally;
  }

  getFirstChoiceTasksGraphData() {

    const tally = this.tallyTasks(this.firstChoiceTasks, 1);
    return tally.map(tallyEntry => {
      return {
        name: tallyEntry.taskName,
        value: tallyEntry.tally
      };
    });

  }

  firstChoiceTooltipFunction(val) {


    return `Picked as 1st choice ${val.data['value']} times`;

  }
  mode(arr: SurveyAnswer[]) {
    return arr.sort((a, b) =>
      arr.filter(v => v.taskId === a.taskId).length
      - arr.filter(v => v.taskId === b.taskId).length
    ).pop();
  }

  ngOnInit() {
    this.mostPopularTask = this.getMostPopularTask();
    this.firstChoiceTasksGraphData = this.getFirstChoiceTasksGraphData();

    this.leastPopularTask = this.getLeastPopularTask();
  }

}

export interface TaskTally {
  taskId: number;
  taskName: string;
  tally: number;
}
