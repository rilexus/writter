import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextAreaComponent } from './text-area.component';
import {FormsModule} from "@angular/forms";
import {ColorModeModule} from "../../../directives/color-mode/color-mode.module";
import { HoverMenueComponent } from './hover-menue/hover-menue.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ColorModeModule
  ],
  declarations: [TextAreaComponent, HoverMenueComponent],
  exports: [TextAreaComponent]
})
export class TextAreaModule { }
