import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpCostMatrixService } from '../../../services/http/http-cost-matrix';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css'],
  providers: [HttpCostMatrixService]
})
export class GeneratorComponent implements OnInit {

  public rowsControl: FormControl;
  public colsControl: FormControl;
  public fillControl: FormControl;

  @Output()
  public matrixChanged = new EventEmitter();

  constructor(public http: HttpCostMatrixService, public fb: FormBuilder) { }

  ngOnInit() {
    this.setupForm();
  }

  setupForm () {
    this.rowsControl = new FormControl(0);
    this.colsControl = new FormControl(0);
    this.fillControl = new FormControl(0);
  }

  generate(){

    if(this.fillControl.value) {

      this.http.getRandomMatrix(this.rowsControl.value, this.colsControl.value)
        .subscribe(
          (res) => {
            console.log(res.json());
            this.updateMatrix(res.json());
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

  updateMatrix(newMatrix: any){
    this.matrixChanged.emit(newMatrix);
  }
}
