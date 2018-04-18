import { Component, Input, OnInit } from '@angular/core';
import { Assignment } from '../../../services/http/interfaces/Assignment';
import { SurveyAnswer } from '../../../services/http/interfaces/SurveyAnswer';
import { ScoredTask } from './ScoredTask';

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

  public mostPopularTask: ScoredTask;
  public leastPopularTask: ScoredTask;

  public maxSelection;

  public firstChoiceTasks: SurveyAnswer[];
  public graphData: {name: string, value: number}[];
  public top3Tasks: { name: string; value: number }[];
  public worst3Tasks: { name: string; value: number }[];

  constructor() { }

  /**
   * This functions uses the lower bound of the wilson score confidence interval for a bernoulli parameter
   * to calculate which tasks are the most popular and which tasks are the least popular
   */
  getAverageTaskRating() {

    const answers: SurveyAnswer[][] = [].concat.apply([], this.assignment.agents.map(agent => agent.answers)
      .filter(ans => !!ans));


    const tasks = this.assignment.tasks.slice();

    return tasks.map(addScore);

    function addScore(task) {

      return <ScoredTask>{
        taskId: task.taskId,
        taskName: task.taskName,
        score: ciLowerBound(
          positiveRatings(answers, task.taskId),
          tallyAnswersWhere(answers, a => a.taskId === task.taskId),
          .95)
      };
    }

    function ciLowerBound(pos, n, confidence) {
      if (n === 0) {
        return 0;
      }
      // z-score for pnormal dist with confidence of 0.95
      // hardcoded for performance reasons
      const z = 1.96;
      const ratio = 1.0 * pos / n;
      return (ratio + z * z / (2 * n) - z * Math.sqrt((ratio * (1 - ratio) + z * z / (4 * n)) / n)) / ( 1 + z * z / n);
    }
    /**
     * A positive rating is defined as a task being selected in an agents top 3 choices
     */
    function positiveRatings(ans, taskID) {
      return tallyAnswersWhere(ans, (val: SurveyAnswer) => val.taskId === taskID && val.cost <= 3);
    }

    /**
     * Helper function that counts the number of answers that fulfill a condition
     * @param ans
     * @param compareFn
     */
    function tallyAnswersWhere(ans, compareFn) {
      return ans.filter(compareFn).length;
    }
  }


  mode(arr: SurveyAnswer[]) {
    return arr.sort((a, b) =>
      arr.filter(v => v.taskId === a.taskId).length
      - arr.filter(v => v.taskId === b.taskId).length
    ).pop();
  }

  ngOnInit() {
    const taskRatings = this.getAverageTaskRating().sort((a, b) => b.score - a.score);
    this.mostPopularTask = taskRatings[0];
    this.leastPopularTask = taskRatings[taskRatings.length - 1];
    this.graphData = taskRatings.map(scoredTask => {
      return {
        name: scoredTask.taskName,
        value: scoredTask.score
      };
    });





    this.maxSelection = this.assignment.surveyOptions.maxSelection === 0
      ? this.assignment.tasks.length + 1 : this.assignment.surveyOptions.maxSelection + 1;

    if (this.graphData.length >= 6) {
      this.top3Tasks = this.graphData.slice(0, 3);
      this.worst3Tasks = this.graphData.slice(this.graphData.length - 3, this.graphData.length);
    }

  }

}

export interface TaskTally {
  taskId: number;
  taskName: string;
  tally: number;
}
