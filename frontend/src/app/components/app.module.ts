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

import { AppComponent } from './app.component';
import { NewProblemComponent } from './new-problem/new-problem.component';

import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { PlaygroundComponent } from './playground/playground.component';
import { PlaygroundModule } from './playground/playground.module';
import { UploadIconComponent } from './new-problem/upload-icon.component';
import { NgUploaderModule } from 'ngx-uploader';

import { AlertServiceComponent } from '../services/alert-service/alert-service.component';
import { AlertService } from '../services/alert-service/alert-service';
import { HttpBaseService } from '../services/http/http-base-service';
import { HttpCSVService } from '../services/http/http-csv-service';
import { HttpCostMatrixService } from '../services/http/http-cost-matrix';
import { ErrorHandlingService } from '../services/error-handling-service/error-handling-service';
import { AssignmentDetailsComponent } from './new-problem/assignment-details/assignment-details.component';
import { EnterTaskAgentsComponent } from './new-problem/task-agents/enter-task-agents/enter-task-agents.component';
import { UploadTaskAgentsComponent } from './new-problem/task-agents/upload-task-agents/upload-task-agents.component';
import { TaskAgentsComponent } from './new-problem/task-agents/task-agents.component';
import { ScrollDisplayComponent } from './new-problem/task-agents/upload-task-agents/scroll-display/scroll-display.component';
import { HttpAssignmentService } from '../services/http/http-assignment-service';
import { AgentLandingPageComponent } from './agent-landing-page/agent-landing-page.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { ModalModule, ProgressbarModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
import { OrganiserLandingPageComponent } from './organiser-landing-page/organiser-landing-page.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpSurveyService } from '../services/http/http-survey-service';
import { SurveyOptionsComponent } from './survey-options/survey-options.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { HttpEmailService } from '../services/http/http-email-service';
import { NgBusyModule } from 'ng-busy';
import { ProgressComponent } from './organiser-landing-page/progress/progress.component';
import { ActionsComponent } from './organiser-landing-page/actions/actions.component';
import { StatsComponent } from './organiser-landing-page/stats/stats.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResultsComponent } from './organiser-landing-page/results/results.component';
import { ResultStatsComponent } from './organiser-landing-page/result-stats/result-stats.component';
import { GroupsComponent } from './organiser-landing-page/groups/groups.component';
import { NewGroupComponent } from './organiser-landing-page/groups/new-group/new-group.component';
import { GeneticResultsComponent } from './organiser-landing-page/actions/genetic-results/genetic-results.component';


/*
 DCOOKE 28/01/2018 - I will be storing the application routes here as there will not be enough routes to warrant a
 separate file
 */
const appRoutes: Routes = [
  { path: '',                           component: HomePageComponent},
  { path: 'playground',                           component: PlaygroundComponent},
  { path: 'new-problem',                           component: NewProblemComponent},
  { path: 'survey/:surveyId',                       component: AgentLandingPageComponent},
  { path: 'assignment/:assignmentId',                       component: OrganiserLandingPageComponent},





];


@NgModule({
  declarations: [
    AppComponent,
    NewProblemComponent,
    HomePageComponent,
    UploadIconComponent,
    UploadTaskAgentsComponent,
    EnterTaskAgentsComponent,
    TaskAgentsComponent,
    ScrollDisplayComponent,
    AlertServiceComponent,
    AssignmentDetailsComponent,
    AgentLandingPageComponent,
    NavbarComponent,
    OrganiserLandingPageComponent,
    SurveyOptionsComponent,
    ProgressComponent,
    ActionsComponent,
    StatsComponent,
    ResultsComponent,
    ResultStatsComponent,
    GroupsComponent,
    NewGroupComponent,
    GeneticResultsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgUploaderModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true}
    ),
    PlaygroundModule,
    NgxDnDModule,
    NgBusyModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    DeviceDetectorModule.forRoot(),
    NgxChartsModule,
    TooltipModule.forRoot()
  ],
  providers: [
    AlertService,
    HttpBaseService,
    HttpCSVService,
    HttpCostMatrixService,
    ErrorHandlingService,
    HttpAssignmentService,
    HttpSurveyService,
    HttpEmailService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

