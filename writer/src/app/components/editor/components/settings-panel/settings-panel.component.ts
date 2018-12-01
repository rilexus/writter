import { Component, OnInit } from '@angular/core';
import {InterfaceService} from "../../../../providers/interface.service";
import {EditorService} from "../../editor.service";

@Component({
  selector: 'app-settings-panel',
  templateUrl: './settings-panel.component.html',
  styleUrls: ['./settings-panel.component.scss']
})
export class SettingsPanelComponent implements OnInit {

  constructor(private interfaceService: InterfaceService, private editorService: EditorService) { }
  
  toggleSidebar() {
    this.interfaceService.toggleSidebar();
  }
  invertColor() {
    this.interfaceService.invertColor();
  }
  ngOnInit() {
  
  }

}
