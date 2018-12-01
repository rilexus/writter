import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-hover-menue',
  templateUrl: './hover-menue.component.html',
  styleUrls: ['./hover-menue.component.scss']
})
export class HoverMenueComponent implements OnInit {

  @Output() mouseOut = new EventEmitter();
  @Output() onHighlight = new EventEmitter();
  @Output() buttonPushed = new EventEmitter<{buttonName: string, value?: any}>();
	
  menueOpen = false;
  
  constructor() { }

  textAreaOpen = false;
  colorAreaOpen = false;
  
  
  pushButton(name: string, value?: any) {
    this.buttonPushed.next({buttonName: name, value: value});
  }
  formatText(type: string, value?: any) {
    if (type === 'headline') {
      this.buttonPushed.next({buttonName: 'fontSize', value: 6});
	    this.buttonPushed.next({buttonName: 'bold', value: null});
    } else if (type === 'subtitle') {
      this.buttonPushed.next({buttonName: 'fontSize', value: 5});
    } else  {
	    this.buttonPushed.next({buttonName: name, value: value});
    }
  }
  
  highlight() {
    this.onHighlight.next();
  }
  onMouseOut() {
    this.mouseOut.next(true);
    this.closeMenue();
  }
  openMenueArea(areaName: string) {
    this.menueOpen = true;
    if (areaName === 'text-menue-area') {
      this.textAreaOpen = true;
	    this.colorAreaOpen = false;
    }
    if (areaName === 'color-menue-area') {
        this.colorAreaOpen = true;
	    this.textAreaOpen = false;
    }
  }
  
  closeMenue() {
	  this.menueOpen = false;
	  this.textAreaOpen = false;
	  this.colorAreaOpen = false;
  }

  ngOnInit() {
  }

}
