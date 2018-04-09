import { Component, Input, OnInit } from '@angular/core';
import { HttpAssignmentService } from '../../../services/http/http-assignment-service';
import { AssignmentResults } from '../../../services/http/interfaces/AssignmentResults';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  @Input()
  public assignmentId: string;

  public columnStrings = {
    'choice': 0,
    'agent': 1,
    'task': 2
  };



  public currentSort = {
    column: this.columnStrings.choice,
    ascending:  true
  };
  public results: AssignmentResults[];

  constructor(public http: HttpAssignmentService) {

  }

  getCostClass(cost: number) {
    switch (cost) {
      case 1 : return 'one-cost-color';
      case 2 : return `two-cost-color`;
      case 3 : return 'three-cost-color';
      case 4 : return 'four-cost-color';
      case 5 : return 'five-cost-color';
      case 6 : return 'six-cost-color';
      case 7 : return 'seven-cost-color';
      case 8 : return 'eight-cost-color';
      case 9 : return 'nine-cost-color';
      case 10 : return 'ten-cost-color';
      default : return 'ten-cost-color';
    }

  }


  sort(column: number, ascending: boolean) {
    this.currentSort.column = column;
    this.currentSort.ascending = ascending;
    const sort = this.currentSort;

    if (sort.column === this.columnStrings.choice) {
      this.results.sort((a, b) => {
        return ascending ? a.cost - b.cost : b.cost - a.cost;
      });
    } else if (sort.column === this.columnStrings.agent) {
      this.results.sort((a, b) => {
        return ascending ? a.agent.email.localeCompare(b.agent.email)
          :  b.agent.email.localeCompare(a.agent.email);
      });
    } else if (sort.column === this.columnStrings.task) {
      this.results.sort((a, b) => {
        return ascending ? a.task.taskName.localeCompare(b.task.taskName)
          :  b.task.taskName.localeCompare(a.task.taskName);
      });
    }

  }

  ngOnInit() {
    if (this.assignmentId) {
      this.http.getAssignmentResults(this.assignmentId)
        .subscribe(
        (res: AssignmentResults[]) => {
                console.log(res);
                this.results = res;
                this.sort(this.columnStrings.choice, true);
              },
          (err) => console.error(err)

              );
    }
  }

}
