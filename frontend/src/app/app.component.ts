import { Component, state, trigger } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '3002 - Initial Commit - Angular works!';

  constructor(public router: Router){

  }

}


