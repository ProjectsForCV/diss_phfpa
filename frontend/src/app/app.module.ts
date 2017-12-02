import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NewProblemComponent } from './new-problem/new-problem.component';

import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: '',                           component: NewProblemComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NewProblemComponent
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
