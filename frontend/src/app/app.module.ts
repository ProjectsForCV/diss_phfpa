import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NewProblemComponent } from './new-problem/new-problem.component';

import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { PlaygroundComponent } from './playground/playground.component';

const appRoutes: Routes = [
  { path: '',                           component: HomePageComponent},
  { path: 'playground',                           component: PlaygroundComponent}

];

@NgModule({
  declarations: [
    AppComponent,
    NewProblemComponent,
    HomePageComponent,
    PlaygroundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true}
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

