import {Component, OnDestroy, OnInit} from '@angular/core';
import {EditorService} from "./editor.service";
import {Subscription} from "rxjs/index";
import {InterfaceService} from "../../providers/interface.service";
import {AuthService} from "../../providers/auth.service";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {
  
  sideBarVisibility; // init on ngInit
  subscriptionToSidebarVisibility: Subscription;
	subscriptionToUserLogin: Subscription;
  
  constructor(
    private editorService: EditorService,
    private interfaceService: InterfaceService,
    private authService: AuthService) { }

  ngOnDestroy() {
    this.subscriptionToSidebarVisibility.unsubscribe();
	  this.subscriptionToUserLogin.unsubscribe();
  }
  
  
  ngOnInit() {
    this.sideBarVisibility =  this.interfaceService.sidebarVisibility;
    this.editorService.fetchTexts();
    this.subscriptionToUserLogin = this.authService.userAuthenticationChanges.subscribe(isAuthenticated => {
      if (isAuthenticated === true) {
	      this.editorService.fetchTexts();
      }
    });
    this.subscriptionToSidebarVisibility = this.interfaceService.sidebarVisibilityChange.subscribe( visibility => {
      this.sideBarVisibility = visibility;
    });
	  this.editorService.loginWithToken()
      .then()
      .catch();
    // this.editorService.createUser();
  }
  
  openSidebar() {
    // this.sideBarPosition = '0%';
  }
  closeSidebar() {
    this.interfaceService.toggleSidebar();
  }
}
