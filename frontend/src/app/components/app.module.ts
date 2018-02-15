/***********************************************************************
 * Date: 28/01/2018
 * Author: Daniel Cooke
 ***********************************************************************/
/*
 DCOOKE 28/01/2018 - The app.module is used to bootstrap the application, it is essential to build dependency trees
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NewProblemComponent } from './new-problem/new-problem.component';

import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { PlaygroundComponent } from './playground/playground.component';
import { PlaygroundModule } from './playground/playground.module';
import { UploadIconComponent } from './new-problem/upload-icon.component';
import { NgUploaderModule } from 'ngx-uploader';
import { UploadAgentsComponent } from './new-problem/upload-agents/upload-agents.component';


/*
 DCOOKE 28/01/2018 - I will be storing the application routes here as there will not be enough routes to warrant a
 separate file
 */
const appRoutes: Routes = [
  { path: '',                           component: HomePageComponent},
  { path: 'playground',                           component: PlaygroundComponent},
  { path: 'new-problem',                           component: NewProblemComponent}


];


@NgModule({
  declarations: [
    AppComponent,
    NewProblemComponent,
    HomePageComponent,
    UploadIconComponent,
    UploadAgentsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgUploaderModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true}
    ),
    PlaygroundModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

