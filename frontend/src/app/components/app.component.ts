/***********************************************************************
 * Date: 28/01/2018
 * Author: Daniel Cooke
 ***********************************************************************/
/*
 DCOOKE 28/01/2018 - The root component of the application
 */
import { Component, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentLandingPageComponent } from './agent-landing-page/agent-landing-page.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /*
   DCOOKE 28/03/2018 - Checks to see if the route is part of the main site, or a landing page for agents
   */
  mainSite() {

    return !this.router.url.includes('survey');

  }
  constructor(public router: Router) {

  }

}


