/***********************************************************************
 * Date: 28/01/2018
 * Author: Daniel Cooke
 ***********************************************************************/
/*
 DCOOKE 28/01/2018 - the landing page for the application
 */
import { animate, Component, OnInit, state, style, transition, trigger } from '@angular/core';
import { Router } from '@angular/router';
import { NgxCarousel } from 'ngx-carousel';

/*
 DCOOKE 28/01/2018 - most of this meta-data is concerned with animations
 */
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit {

  public carousel: NgxCarousel;

  constructor(public router: Router) { }

  ngOnInit() {
    this.carousel = {
      grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
      slide: 1,
      speed: 1000,
      interval: 100000,
      point: {
        visible: true
      },
      load: 2,
      touch: true,
      loop: true,
      custom: 'banner'
    };
  }

  onLoadCarousel(event) {


  }

  /*
   DCOOKE 28/01/2018 - navigates away from this route to the specified route in the param
   */
  navigate(route: string) {
    this.router.navigate(['/' + route]);

  }

}
