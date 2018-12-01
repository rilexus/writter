import { Component, OnInit } from '@angular/core';
import {EditorService} from "../../editor.service";
import {fading} from "../../../../style/animations/animations";
import {Subscription} from "rxjs/index";
import {AuthService} from "../../../../providers/auth.service";


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
	animations: [fading]
	
})
export class SidebarComponent implements OnInit {
	userIsSearching = false;
	userLogedIn = false;
	userAuthenticationSubscription: Subscription;
  constructor(private editorService: EditorService, private authService: AuthService) { }
	
	elevate($event) {
  	if ($event === true) {
		  this.userIsSearching = true;
	  } else {
		  this.userIsSearching = false;
	  }
	}
	
  ngOnInit() {
  	this.userLogedIn = this.authService.userIsAuthenticated;
  	this.userAuthenticationSubscription = this.authService.userAuthenticationChanges
		  .subscribe(isAuthenticated => {
		  	this.userLogedIn = isAuthenticated as boolean;
		  });
  
  }
  
}
