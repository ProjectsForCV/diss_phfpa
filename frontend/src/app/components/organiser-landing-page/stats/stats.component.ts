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
  @Input()
  public assignmentId: string;

  public mostPopularTask: SurveyAnswer;

  public maxSelection;

  public firstChoiceTasks: SurveyAnswer[];
  public mostPopularTasksGraphData: any;
  private leastPopularTask: SurveyAnswer;
  private leastPopularTasks: SurveyAnswer[];
  public leastPopularTasksGraphData: any;

  constructor() { }

  getMostPopularTask(): SurveyAnswer {
    const answers: SurveyAnswer[][] = this.assignment.agents.map(agent => agent.answers)
      .filter(ans => !!ans);



    // Get a list of all the tasks that have been chosen as first choices
    const mostPopularTasks = answers.map(popular => {
      return popular.filter(answer => answer.cost === 1)[0];
    });


    this.firstChoiceTasks = mostPopularTasks.slice() || [];


    return this.mode(mostPopularTasks);

  }

  getLeastPopularTask(): SurveyAnswer {
    const answers: SurveyAnswer[][] = this.assignment.agents.map(agent => agent.answers)
      .filter(ans => !!ans);


    let leastPopularTasks = [];
    // If the survey allowed agents to select a task that they do not wish to complete, check for the
    // most opted out task
    if (!this.assignment.surveyOptions.allowOptOut) {



      leastPopularTasks = answers.map(leastPopular => {

        return leastPopular.filter(answer => answer.cost >= this.maxSelection)[0] || [];
      });
    } else {
      leastPopularTasks = answers.map(leastPopular => {
        return leastPopular.filter(answer => answer.cost === 999)[0] || [];
      });
    }



    this.leastPopularTasks = leastPopularTasks.slice() || [];



    return this.mode(leastPopularTasks);
  }

  tallyTasks(taskList: SurveyAnswer[], cost: number): TaskTally[] {
    if (!taskList || taskList.length === 0) {
      return;
    }

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

  getMostPopularTasksGraphData() {


    const tally = this.tallyTasks(this.firstChoiceTasks, 1);
    return tally.map(tallyEntry => {
      return {
        name: tallyEntry.taskName,
        value: tallyEntry.tally
      };
    });

  }

  getLeastPopularTasksGraphData() {


    const tally = this.tallyTasks(this.leastPopularTasks, this.assignment.surveyOptions.allowOptOut
      ? 999 : this.maxSelection);
    return tally.map(tallyEntry => {
      return {
        name: tallyEntry.taskName,
        value: tallyEntry.tally
      };
    });

  }

  mostPopularChoiceTooltipFunction(val) {
    return `Picked as 1st choice ${val.data['value']} times`;
  }

  leastPopularChoiceTooltipFunction(val) {

    return `Not selected ${val.data['value']} times`;

  }
  mode(arr: SurveyAnswer[]) {
    return arr.sort((a, b) =>
      arr.filter(v => v.taskId === a.taskId).length
      - arr.filter(v => v.taskId === b.taskId).length
    ).pop();
  }

  ngOnInit() {
    this.mostPopularTask = this.getMostPopularTask();
    this.mostPopularTasksGraphData = this.getMostPopularTasksGraphData();

    this.maxSelection = this.assignment.surveyOptions.maxSelection === 0
      ? this.assignment.tasks.length + 1 : this.assignment.surveyOptions.maxSelection + 1;

    this.leastPopularTask = this.getLeastPopularTask();
    this.leastPopularTasksGraphData = this.getLeastPopularTasksGraphData();
  }

}

export interface TaskTally {
  taskId: number;
  taskName: string;
  tally: number;
}
