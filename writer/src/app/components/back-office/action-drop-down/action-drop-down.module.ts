import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionDropDownComponent } from './action-drop-down.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [ActionDropDownComponent],
    exports: [ActionDropDownComponent]
})
export class ActionDropDownModule { }
