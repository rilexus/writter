import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PreviewListComponent} from "./preview-list.component";
import {ColorModeModule} from "../../../../../directives/color-mode/color-mode.module";
import {SearchBarModule} from "./search-bar/search-bar.module";

@NgModule({
  imports: [
    CommonModule,
	  ColorModeModule,
    SearchBarModule
  ],
  declarations: [PreviewListComponent],
  exports: [PreviewListComponent]
})
export class PreviewListModule { }
