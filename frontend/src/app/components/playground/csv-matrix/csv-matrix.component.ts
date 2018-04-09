import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AgentTaskMode } from '../../new-problem/AgentTaskMode';
import { HttpCSVService } from '../../../services/http/http-csv-service';

@Component({
  selector: 'app-csv-matrix',
  templateUrl: './csv-matrix.component.html',
  styleUrls: ['./csv-matrix.component.css']
})
export class CsvMatrixComponent implements OnInit {

  @Input()
  public matrixSubscription: BehaviorSubject<number[][]> = new BehaviorSubject<number[][]>(null);

  private _fileList: FileList;

  public fileName = 'No file chosen';

  constructor(public http: HttpCSVService) { }

  ngOnInit() {
  }

  public getFile() {
    return this._fileList[0];
  }

  fileChanged(fileEvent) {
    if (fileEvent.target.files && fileEvent.target.files.length > 0) {
      this._fileList = fileEvent.target.files;
      this.fileName = this.getFile().name;
    }

  }

  upload() {
    const csv = this.getFile();

    this.http.postCostMatrixCSV(csv)
      .subscribe(
        res => this.matrixSubscription.next(res)
      );
  }
}
