import { Component, OnInit } from '@angular/core';
import { HttpCostMatrixService } from '../../services/http/http-cost-matrix';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {

  public matrixSubscriber: BehaviorSubject<number[][]> = new BehaviorSubject<number[][]>(null);
  public matrix: number[][];

  public solutionSubscriber: BehaviorSubject<number[][]> = new BehaviorSubject<number[][]>(null);
  public solution: number[][];

  constructor(public http: HttpCostMatrixService) { }


  solve() {
    this.http.postSolveMatrix(this.matrix)
      .subscribe(
        (res) => {
          this.solutionSubscriber.next(res.json());
        },
          err => console.error(err),
        () => console.dir('HTTP Post complete')
      );
  }

  ngOnInit() {

    this.matrixSubscriber.subscribe(
      (mat) => {
        this.matrix = mat;
        debugger;
      }
    )
  }

}
