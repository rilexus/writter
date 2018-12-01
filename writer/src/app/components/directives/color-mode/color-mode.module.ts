import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ColorModeDirective} from "./color-mode.directive";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ColorModeDirective
  ],
  exports: [
    ColorModeDirective
  ]
})
export class ColorModeModule { }
