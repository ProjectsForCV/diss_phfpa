import { Component, OnInit } from '@angular/core';
import { HttpCostMatrixService } from '../../services/http/http-cost-matrix';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {

  public matrix: number[][];

  public solution: number[][];
  constructor(public http: HttpCostMatrixService) { }

  matrixChanged(mat: any){

    this.matrix = mat;
    this.solution = undefined;
  }

  solve(){
    this.http.postSolveMatrix(this.matrix)
      .subscribe(
        (res) => {
          this.solution = res.json();
        },
          err => console.error(err),
        () => console.dir('HTTP Post complete')
      )
  }

  ngOnInit() {
  }

}
