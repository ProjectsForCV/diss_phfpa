/***********************************************************************
 * Date: 28/01/2018
 * Author: Daniel Cooke
 ***********************************************************************/
/*
 DCOOKE 28/01/2018 - The app.module is used to bootstrap the application, it is essential to build dependency trees
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NewProblemComponent } from './new-problem/new-problem.component';

import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { PlaygroundComponent } from './playground/playground.component';
import { PlaygroundModule } from './playground/playground.module';
import { UploadIconComponent } from './new-problem/upload-icon.component';
import { NgUploaderModule } from 'ngx-uploader';
import { UploadAgentsComponent } from './new-problem/agents/upload-agents/upload-agents.component';
import { AgentsComponent } from './new-problem/agents/agents.component';
import { EnterAgentsComponent } from './new-problem/agents/enter-agents/enter-agents.component';
import { ScrollDisplayComponent } from './new-problem/agents/upload-agents/scroll-display/scroll-display.component';
import { AlertServiceComponent } from '../services/alert-service/alert-service.component';
import { AlertService } from '../services/alert-service/alert-service';


/*
 DCOOKE 28/01/2018 - I will be storing the application routes here as there will not be enough routes to warrant a
 separate file
 */
const appRoutes: Routes = [
  { path: '',                           component: NewProblemComponent},
  { path: 'playground',                           component: PlaygroundComponent},
  { path: 'new-problem',                           component: NewProblemComponent}


];


@NgModule({
  declarations: [
    AppComponent,
    NewProblemComponent,
    HomePageComponent,
    UploadIconComponent,
    UploadAgentsComponent,
    AgentsComponent,
    EnterAgentsComponent,
    ScrollDisplayComponent,
    AlertServiceComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    NgUploaderModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true}
    ),
    PlaygroundModule
  ],
  providers: [AlertService],
  bootstrap: [AppComponent]
})
export class AppModule { }

