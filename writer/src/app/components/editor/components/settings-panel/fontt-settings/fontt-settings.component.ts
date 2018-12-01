import { Component, OnInit } from '@angular/core';
import {EditorService} from "../../../editor.service";
import {Subscription} from "rxjs/index";

@Component({
  selector: 'app-fontt-settings',
  templateUrl: './fontt-settings.component.html',
  styleUrls: ['./fontt-settings.component.scss']
})
export class FonttSettingsComponent implements OnInit {
  
  subscriptionToTextChange: Subscription;
  constructor(private editorService: EditorService) { }

  fontfamilys = [];
  selectedFontFamily = 'Lucida Sans Typewriter';
  
  dropDownValues = [];
  
  selectFontFamily(value): void {
    this.selectedFontFamily = value;
    this.dropDownValues = [];
    this.editorService.selectFontFamily(value);
  }
  
  openDropDown() {
    this.dropDownValues = this.fontfamilys;
  }
  closeDropDown() {
    this.dropDownValues = [];
  }
  
  increaseFontSize() {
    this.editorService.increaseFontSize();
  }
  decreaseFontSize() {
    this.editorService.decreaseFontSize();
  }
  
  setDefault() {
    this.editorService.setDefaultTextareaFontSize();
  }
  
  ngOnInit() {
    this.fontfamilys = this.editorService.getFontFamilies();
    this.subscriptionToTextChange = this.editorService.selectedTextChange.subscribe( text => {
      this.selectedFontFamily = text.confData.fontFamily;
    })
  }

}
