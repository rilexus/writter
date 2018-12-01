import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import {ColorModeModule} from "../../../directives/color-mode/color-mode.module";
import {PreviewListModule} from "./components/preview-list/preview-list.module";
import {AuthenticationModule} from "../../../shared/components/authentication/authentication.module";
import {UserProfileModule} from "./components/user-profile/user-profile.module";


@NgModule({
	imports: [
		CommonModule,
		ColorModeModule,
		PreviewListModule,
		AuthenticationModule,
		UserProfileModule
	],
	declarations: [
		SidebarComponent,
	],
	exports: [
		SidebarComponent
	]
})
export class SidebarModule { }
