import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public playgroundCss = 'tab';
  public homeCss = 'active-tab';
  public assignmentCss = 'tab';

  constructor(public router: Router) { }

  ngOnInit() {
    this.router.events.subscribe(
      (navigationEnd: NavigationEnd) => {
        if (navigationEnd.url && navigationEnd.url !== '') {

          this.updateActiveTab(navigationEnd.url);
        }
      }
    );
  }

  navigate(route: string) {

    this.router.navigate([route]);


  }

  private updateActiveTab(url) {
    const route = url;
    this.playgroundCss = 'tab';
    this.homeCss = 'tab';
    this.assignmentCss = 'tab';

    if (route.includes('playground')) {
      this.playgroundCss = 'active-tab';
    } else if (route.includes('problem')) {
      this.assignmentCss = 'active-tab';
    } else {
      this.homeCss = 'active-tab';
    }
  }
}
