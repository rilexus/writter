import {Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';

import {Subscription} from "rxjs/index";
import {InterfaceService} from "../../../providers/interface.service";

@Directive ({
  selector: '[appColorMode]'
})
export class ColorModeDirective implements OnInit, OnDestroy {

  private _applicationState: string;
  private subscriptionToColorChange: Subscription;

  constructor(
    private hostElement: ElementRef,
    private renderer: Renderer2,
    private interfaceService: InterfaceService) { }
    

  ngOnInit() {
    this._applicationState =  this.interfaceService.getColorModeClassName(); // get state on init
    this.renderer.addClass(this.hostElement.nativeElement, this._applicationState); // add state class to hostelement
    
    this.subscriptionToColorChange = this.interfaceService.colorChanges.subscribe( colorClass => {
      this._applicationState = colorClass as string;
      this.renderer.removeClass(this.hostElement.nativeElement, 'light'); // removes classes if added before
      this.renderer.removeClass(this.hostElement.nativeElement, 'dark'); // removes classes if added before
      this.renderer.addClass(this.hostElement.nativeElement, colorClass as string); // add new state class

    
    });
  }

  ngOnDestroy() {
    this.subscriptionToColorChange.unsubscribe();
  }

}
