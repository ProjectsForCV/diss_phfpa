import { NgModule } from '@angular/core';
import { HttpCostMatrixService } from '../../services/http/http-cost-matrix';
import { PlaygroundComponent } from './playground.component';
import { BrowserModule } from '@angular/platform-browser';
import { GeneratorComponent } from './generator/generator.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@NgModule({
    declarations: [
      PlaygroundComponent,
      GeneratorComponent
    ],
    imports: [
      BrowserModule,
      CommonModule,
      FormsModule
    ],
    providers: [
      HttpCostMatrixService
    ]
})
export class PlaygroundModule {
}
