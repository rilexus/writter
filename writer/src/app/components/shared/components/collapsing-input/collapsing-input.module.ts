import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollapsingInputComponent } from './collapsing-input.component';
import {FormsModule} from "@angular/forms";
import {ColorModeModule} from "../../../directives/color-mode/color-mode.module";

@NgModule({
  imports: [
    CommonModule,
	  FormsModule,
	  ColorModeModule
  ],
  declarations: [CollapsingInputComponent],
  exports: [CollapsingInputComponent]
})
export class CollapsingInputModule { }
