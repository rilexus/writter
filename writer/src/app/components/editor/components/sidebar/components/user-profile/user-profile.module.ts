import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile.component';
import {AuthService} from "../../../../../../providers/auth.service";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    UserProfileComponent,
  ],
  providers: [
    AuthService
  ],
  exports: [
	  UserProfileComponent,
  ]
})
export class UserProfileModule { }
