import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-action-drop-down',
  templateUrl: './action-drop-down.component.html',
  styleUrls: ['./action-drop-down.component.scss']
})
export class ActionDropDownComponent implements OnInit {

  constructor() { }
  
  @Input() actions: string[] = [];
  actionsAreVisible = false;
  @Output() actionClicked = new EventEmitter<string>();
  
  showActionList() {
	  this.actionsAreVisible = true;
  }
	hideActionList() {
		this.actionsAreVisible = false;
  }

  ngOnInit() {
  }

}
