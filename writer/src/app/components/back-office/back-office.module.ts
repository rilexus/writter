import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackOfficeComponent } from './back-office.component';
import { UsersListComponent } from './users-list/users-list.component';
import {RouterModule} from "@angular/router";
import {BackOfficeService} from "./back-office.service";
import {HttpClientModule} from "@angular/common/http";
import {ActionDropDownModule} from "./action-drop-down/action-drop-down.module";

import {CollapsingInputModule} from "../shared/components/collapsing-input/collapsing-input.module";
import {HttpOptionsService} from "../../providers/http-options.service";

@NgModule({
    imports: [
      CommonModule,
      RouterModule,
      HttpClientModule,
      ActionDropDownModule,
      CollapsingInputModule,
    ],
    declarations: [
      BackOfficeComponent,
      UsersListComponent
    ],
    providers: [
      BackOfficeService,
      HttpOptionsService
    ]
})
export class BackOfficeModule { }
