import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-collapsing-input',
  templateUrl: './collapsing-input.component.html',
  styleUrls: ['./collapsing-input.component.scss']
})
export class CollapsingInputComponent implements OnInit {
	
  @Input() inputPlaceHolder = '';
	@Input() iconName = '';
  @Output() inputEvent =  new EventEmitter<string>();
  
  inputHasAccured = false;
  
	searchInputFieldIsVisible = false;
	searchIconVisible = true;
	searchNameValue = '';
  
  constructor() { }
	
  emitInputEvent(eventValue: string) {
	  this.inputHasAccured = true;
    this.showSearchInputField();
    this.inputEvent.emit(eventValue);
  }
	
	showSearchInputField() {
		this.searchInputFieldIsVisible = true;
		this.searchIconVisible = false;
	}
	hideSearchInputField() {
		this.searchInputFieldIsVisible = false;
		this.searchNameValue = ''; // clear input field
		
		// if user has searched emite empty string
		if (this.inputHasAccured === true) {
			this.inputEvent.emit('');
			this.inputHasAccured = false;
		}
		setTimeout(() => {
			this.searchIconVisible = true;
		}, 400); // animation time of input hiding
	}
  
  

  ngOnInit() {
  }

}
