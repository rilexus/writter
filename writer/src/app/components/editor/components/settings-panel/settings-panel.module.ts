import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsPanelComponent } from './settings-panel.component';
import { FonttSettingsComponent } from './fontt-settings/fontt-settings.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SettingsPanelComponent, FonttSettingsComponent],
  exports: [SettingsPanelComponent]
})
export class SettingsPanelModule { }
