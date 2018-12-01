import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {ColorModeModule} from "../../../../../../directives/color-mode/color-mode.module";
import {CollapsingInputModule} from "../../../../../../shared/components/collapsing-input/collapsing-input.module";
import {SearchBarComponent} from "./search-bar.component";



@NgModule({
  imports: [
    CommonModule,
	  FormsModule,
	  ColorModeModule,
	  CollapsingInputModule
  ],
  declarations: [SearchBarComponent],
    exports: [SearchBarComponent]
})
export class SearchBarModule { }
