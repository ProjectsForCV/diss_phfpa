/***********************************************************************
 * Date: 28/01/2018
 * Author: Daniel Cooke
 ***********************************************************************/
/*
 DCOOKE 28/01/2018 - the landing page for the application
 */
import { animate, Component, OnInit, state, style, transition, trigger } from '@angular/core';
import { Router } from '@angular/router';

/*
 DCOOKE 28/01/2018 - most of this meta-data is concerned with animations
 */
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit {

  /*
   DCOOKE 28/01/2018 - the continue button will control the flow of the pages
   */
  continueButtonVisible = false;

  /*
   DCOOKE 28/01/2018 - the page that the user is presented with is controlled by this variable
   */
  page = 0;

  constructor(public router: Router) { }

  ngOnInit() {
    this.hideContinueButton();
  }

  /*
   DCOOKE 28/01/2018 - this method will be called anytime the page is changed, so the continue button is not present
   immediately for cosmetic purposes.
   */
  hideContinueButton() {
    this.continueButtonVisible = false;
    if (this.page !== 3) {
      setTimeout(() => {
        this.continueButtonVisible = true;
      }, 100);
    }
  }

  /*
   DCOOKE 28/01/2018 - called when the continue button is pressed, will move to the next page
   */
  next() {
    this.page++;
    this.hideContinueButton();

  }

  /*
   DCOOKE 28/03/2018 - used to scroll the screen to the specified element
  /*


   */
  scrollTo(el) {
    el.scrollIntoView();
  }
  /*
   DCOOKE 28/01/2018 - navigates away from this route to the specified route in the param
   */
  navigate(route: string) {
    this.router.navigate(['/' + route]);

  }

}
