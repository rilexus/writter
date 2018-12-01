import { Injectable } from '@angular/core';
import {Subject} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class InterfaceService {
  
  sidebarVisibilityChange = new Subject<boolean>();
  colorChanges = new Subject<string>();
  colorModeClassName = 'light';
	private _sidebarVisibility = true;
	
	
  getColorModeClassName(): string {
    return this.colorModeClassName;
  }
  get sidebarVisibility(): boolean {
    return this._sidebarVisibility;
  }
  
  invertColor(): void {
    if (this.colorModeClassName === 'dark') {
      this.colorModeClassName = 'light';
      this.colorChanges.next(this.colorModeClassName);
      return;
    } else {
      this.colorModeClassName = 'dark';
      this.colorChanges.next(this.colorModeClassName);
    }
  }
  
  set sidebarVisibility(value: boolean) {
    this._sidebarVisibility = value;
    this.sidebarVisibilityChange.next(this._sidebarVisibility);
  }
  
  constructor() { }
  
  toggleSidebar() {
    this.sidebarVisibility = !this.sidebarVisibility;
  }
  
}
