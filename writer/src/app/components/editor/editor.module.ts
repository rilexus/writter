import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor.component';
import {SettingsPanelModule} from "./components/settings-panel/settings-panel.module";
import {TextAreaModule} from "./components/text-area/text-area.module";
import {EditorService} from "./editor.service";
import { StatsComponent } from './components/stats/stats.component';
import {SidebarModule} from "./components/sidebar/sidebar.module";
import {ColorModeModule} from "../directives/color-mode/color-mode.module";
import { MiniViewComponent } from './components/mini-view/mini-view.component';
import {HttpClientModule} from "@angular/common/http";
import {HttpOptionsService} from "../../providers/http-options.service";


@NgModule({
	imports: [
		CommonModule,
		SettingsPanelModule,
		TextAreaModule,
		SidebarModule,
		ColorModeModule,
		HttpClientModule
	],
	declarations: [
		EditorComponent,
		StatsComponent,
		MiniViewComponent,
	],
	providers: [
		EditorService,
		HttpOptionsService
	],
	exports: [EditorComponent]
})
export class EditorModule { }
