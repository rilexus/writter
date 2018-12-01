import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../../providers/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  signUpISVisible = false;
  loginIsInvalid = false;
	constructor(private authService: AuthService, private router: Router) { }
	
	ngOnInit() {}
	
	login($event) {
		this.authService.login($event)
			.then(loginValid => {
				if (this.router.url === '/auth') {
					this.router.navigate([this.authService.redirectUrl]);
				}
			})
			.catch(invalid => {
			this.loginIsInvalid = invalid;
		});
	}
  
 
	
	showSignUp() {
		this.signUpISVisible = true;
  }
	showLogin() {
		this.signUpISVisible = false;
	}

}
