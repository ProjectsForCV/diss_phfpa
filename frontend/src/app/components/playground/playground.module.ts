import { NgModule } from '@angular/core';
import { HttpCostMatrixService } from '../../services/http/http-cost-matrix';
import { PlaygroundComponent } from './playground.component';
import { BrowserModule } from '@angular/platform-browser';
import { GeneratorComponent } from './generator/generator.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatrixComponent } from './matrix/matrix.component';
@NgModule({
    declarations: [
      PlaygroundComponent,
      GeneratorComponent,
      MatrixComponent
    ],
    imports: [
      BrowserModule,
      CommonModule,
      FormsModule,
      ReactiveFormsModule
    ],
    providers: [
      HttpCostMatrixService
    ]
})
export class PlaygroundModule {
}
