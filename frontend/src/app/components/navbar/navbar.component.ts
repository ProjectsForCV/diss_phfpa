import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public activeTab = 'home';

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


    if (route.includes('playground')) {
      this.activeTab = 'playground';
    } else if (route.includes('problem')) {
      this.activeTab = 'assignment';
    } else {
      this.activeTab = 'home';

    }
  }
}
