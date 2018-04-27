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

  public numberOfTasks: number;

  public mostPopularTask: ScoredTask;
  public leastPopularTask: ScoredTask;

  public maxSelection;

  public firstChoiceTasks: SurveyAnswer[];
  public graphData: {name: string, value: number}[];
  public top3Tasks: { name: string; value: number }[];
  public worst3Tasks: { name: string; value: number }[];
  public mostPopularTasksGraphData: any;
  public leastPopularTasksGraphData: any;

  constructor() { }

  /**
   * This functions uses the lower bound of the wilson score confidence interval for a bernoulli parameter
   * to calculate which tasks are the most popular tasks
   */
  getMostPopularTaskRatings() {
    const answers: SurveyAnswer[][] = [].concat.apply([], this.assignment.agents.map(agent => agent.answers)
      .filter(ans => !!ans));

    const tasks = this.assignment.tasks.slice();

    return tasks.map(task => this.addPositiveScore(task, answers));
  }

  /**
   * This functions does the same thing as getMostPoplarTaskRatings except it defines a negative ratio based on how
   * many tasks receive the worst possible score
   * @returns {ScoredTask[]}
   */
  getLeastPopularTaskRatings() {
    const answers: SurveyAnswer[][] = [].concat.apply([], this.assignment.agents.map(agent => agent.answers)
      .filter(ans => !!ans));

    const tasks = this.assignment.tasks.slice();

    return tasks.map( task => this.addNegativeScore(task, answers));
  }

  /**
   * Returns average rating for positive tasks
   * @param task
   * @returns {ScoredTask}
   */
  addPositiveScore(task, answers) {


    return <ScoredTask>{
      taskId: task.taskId,
      taskName: task.taskName,
      score: this.ciLowerBound(
        this.positiveRatings(answers, task.taskId),
        this.tallyAnswersWhere(answers, a => a.taskId === task.taskId),
        .95)
    };
  }

  /**
   * Returns average rating for negative tasks
   * @param task
   * @returns {ScoredTask}
   */
  addNegativeScore(task, answers) {


    return <ScoredTask>{
      taskId: task.taskId,
      taskName: task.taskName,
      score: this.ciLowerBound(
        this.negativeRatings(answers, task.taskId),
        this.tallyAnswersWhere(answers, a => a.taskId === task.taskId),
        .95)
    };
  }


  /**
   * This function calculates the lower bound of the wilson score confidence interval for a bernoulli parameter
   * @param pos
   * @param n
   * @param confidence
   * @returns {number}
   */
  ciLowerBound(pos, n, confidence) {
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
  positiveRatings(ans, taskID) {
    return this.tallyAnswersWhere(ans, (val: SurveyAnswer) => val.taskId === taskID && val.cost <= 3);
  }

  /**
   * A positive rating is defined as a task being selected in an agents top 3 choices
   */
  negativeRatings(ans, taskID) {
    const negativeThreshold = this.assignment.surveyOptions.allowOptOut ? 999 : this.maxSelection;
    return this.tallyAnswersWhere(ans, (val: SurveyAnswer) => val.taskId === taskID && val.cost >= negativeThreshold);
  }

  /**
   * Helper function that counts the number of answers that fulfill a condition
   * @param ans
   * @param compareFn
   */
  tallyAnswersWhere(ans, compareFn) {
    return ans.filter(compareFn).length;
  }


  /**
   * Returns the most commonly occuring item in a set
   * @param {SurveyAnswer[]} arr
   * @returns {SurveyAnswer | undefined}
   */
  mode(arr: SurveyAnswer[]) {
    return arr.sort((a, b) =>
      arr.filter(v => v.taskId === a.taskId).length
      - arr.filter(v => v.taskId === b.taskId).length
    ).pop();
  }

  /**
   * Init function
   */
  ngOnInit() {
    this.maxSelection = this.assignment.surveyOptions.maxSelection === 0
      ? this.assignment.tasks.length + 1 : this.assignment.surveyOptions.maxSelection + 1;

    this.numberOfTasks = this.assignment.tasks.length;

    const mostPopularTasks = this.getMostPopularTaskRatings().sort((a, b) => b.score - a.score);
    this.mostPopularTask = mostPopularTasks[0];

    const leastPopularTasks = this.getLeastPopularTaskRatings().sort((a, b) => b.score - a.score);
    this.leastPopularTask = leastPopularTasks[0];

    debugger;
    // Required structure for ngx-charts api
    this.mostPopularTasksGraphData = mostPopularTasks.map(scoredTask => {
      return {
        name: scoredTask.taskName,
        value: scoredTask.score
      };
    });

    // Required structure for ngx-charts api
    this.leastPopularTasksGraphData = leastPopularTasks.map(scoredTask => {
      return {
        name: scoredTask.taskName,
        value: scoredTask.score
      };
    });


    if (this.numberOfTasks >= 6) {
      this.top3Tasks = this.mostPopularTasksGraphData.slice(0, 3);
      this.worst3Tasks = this.leastPopularTasksGraphData.slice(0, 3);
    }

  }

}

