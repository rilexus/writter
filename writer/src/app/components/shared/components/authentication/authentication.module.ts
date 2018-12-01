import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ColorModeModule} from "../../../directives/color-mode/color-mode.module";
import {AuthenticationComponent} from "./authentication.component";
import {LoginComponent} from "./componetns/login/login.component";
import {SignupComponent} from "./componetns/signup/signup.component";



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
	  ReactiveFormsModule,
    ColorModeModule
  ],
  declarations: [
    AuthenticationComponent,
    LoginComponent,
    SignupComponent,
  ],
  exports: [AuthenticationComponent]
})
export class AuthenticationModule { }
