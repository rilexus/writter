import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {EditorModule} from "./components/editor/editor.module";
import {HeaderModule} from "./components/header/header.module";
import {InterfaceService} from "./providers/interface.service";
import {ColorModeModule} from "./components/directives/color-mode/color-mode.module";
import {FormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AppRoutesModule} from "./appRoutes";
import {BackOfficeModule} from "./components/back-office/back-office.module";
import {AuthService} from "./providers/auth.service";
import {LoginPageModule} from "./components/login-page/login-page.module";
import {HttpService} from "./providers/http.service";


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
	  BrowserModule,
	  EditorModule,
	  LoginPageModule,
	  AppRoutesModule,
	  BackOfficeModule,
	  
	  FormsModule,
	  HeaderModule,
	  ColorModeModule,
	  BrowserAnimationsModule,
  ],
  providers: [
  	InterfaceService,
	  AuthService,
	  HttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
