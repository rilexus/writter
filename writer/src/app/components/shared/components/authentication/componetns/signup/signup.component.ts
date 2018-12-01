import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import { Validators } from '@angular/forms';
import {AuthService} from "../../../../../../providers/auth.service";


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private authService: AuthService) { }
  
	@Output() showLogin = new EventEmitter();
	
  passwordIsFocused = false;
	passwordConfirmIsFocused = false;
	passAreEqual = false;
	
	indicatorLength = 0;
	passwordMinLength = 8;
	
	signup = new FormGroup({
		name: new FormControl('', Validators.required),
		email: new FormControl('', Validators.required),
		password: new FormControl('', Validators.minLength(this.passwordMinLength)),
		conf_password: new FormControl('', Validators.required),
	});
	
	
	handlePasswordInput($event) {
		const x = $event.target.value.length;
		if (x === 0) {
			this.indicatorLength = 0; // length of the blue line
		} else {
			const lenght = 100 * x / this.passwordMinLength;
			this.indicatorLength = lenght > 100 ? 100 : lenght;
		}
		this.checkIfEqual(this.signup.value.conf_password); // mark conft password field green
	}
	
	checkIfEqual(value) {// checks if password field are equal; draws conf_password indicator green
		this.passAreEqual = this.signup.value.password === value && value !== '' && this.passwordIsValid;
	}
	
	get passwordIsValid() {
		if (this.indicatorLength === 100) { // indicator length is 100%
			return true;
		}
		return false;
	}
	
	get indicatorLineWidth() {
		return this.indicatorLength + '%';
	}
	
	_showLogin() {
	  this.showLogin.emit();
  }
  
	handleInputFocus($event) {
		this.passwordIsFocused = true;
	}
	handleInputUnfocus($event) {
		this.passwordIsFocused = false;
	}
	
	onSubmit() {
		if (this.signup.status === 'VALID') {
			const name = this.signup.value.name;
			const password = this.signup.value.password;
			const email = this.signup.value.email;
			this.authService.createUser({email, name, password});
		}
		console.log(this.signup);
	}
	
  signUp() {
	 
  }

  ngOnInit() {}

}
