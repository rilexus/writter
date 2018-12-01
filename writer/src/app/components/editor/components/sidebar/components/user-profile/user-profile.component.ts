import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../../../../providers/auth.service";
import {Subscription} from "rxjs/index";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  constructor(private authService: AuthService) { }
  subscriptionToUserLogin: Subscription;
  userIsLogedin = false;
  ngOnInit() {
    this.userIsLogedin = this.authService.userIsAuthenticated;
    this.subscriptionToUserLogin = this.authService.userAuthenticationChanges.subscribe(isAuthenticated => {
	    this.userIsLogedin = isAuthenticated as boolean;
    });
  }
	
	logout() {
    this.authService.logout();
  }

}
