import { Component, Input, OnInit } from '@angular/core';
import { GeneticAssignmentResults } from '../../../../services/http/interfaces/GeneticAssignmentResults';

@Component({
  selector: 'app-genetic-results',
  templateUrl: './genetic-results.component.html',
  styleUrls: ['./genetic-results.component.css']
})
export class GeneticResultsComponent implements OnInit {

  @Input()
  public geneticResults: GeneticAssignmentResults[] = [];

  constructor() { }

  ngOnInit() {

  };

}
