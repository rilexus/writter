import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './login-page.component';
import {AuthenticationModule} from "../shared/components/authentication/authentication.module";

@NgModule({
  imports: [
    CommonModule,
	  AuthenticationModule
  ],
  declarations: [LoginPageComponent],
	exports: [LoginPageComponent],
})
export class LoginPageModule { }
