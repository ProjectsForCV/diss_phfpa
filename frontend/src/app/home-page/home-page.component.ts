import { animate, Component, OnInit, state, style, transition, trigger } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  animations: [
    trigger('continueButton', [
      state('hide', style({
        opacity: 0
      })),

      state('show', style({
        opacity: 1
      })),

      transition('hide => show' , animate('1000ms ease-in')),
      transition('show => hide' , animate('1000ms ease-out'))

    ])
  ]
})

export class HomePageComponent implements OnInit {


  continueButtonVisible = false;

  page = 0;
  constructor(public router: Router) { }

  ngOnInit() {

    this.hideContinueButton();
  }

  hideContinueButton() {
    this.continueButtonVisible = false;
    if (this.page !== 3) {
      setTimeout(() => {
        this.continueButtonVisible = true;
      }, 100);
    }
  }

  next() {
    this.page++;
    this.hideContinueButton();

  }

  navigate(route: string) {

    this.router.navigate(['/' + route]);

  }

}
