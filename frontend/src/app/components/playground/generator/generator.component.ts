import { Component, OnInit } from '@angular/core';
import { HttpCostMatrixService } from '../../../services/http/http-cost-matrix';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css'],
  providers: [HttpCostMatrixService]
})
export class GeneratorComponent implements OnInit {

  constructor(public http: HttpCostMatrixService) { }

  ngOnInit() {
  }

  generate(){
    this.http.getRandomMatrix()
      .subscribe(
        (res) => {
          console.log(res.json());
        },
        (err) => {
          console.error(err);
        },
        () => {
          console.dir('HTTP Call complete');
        }
      );
  }
}
