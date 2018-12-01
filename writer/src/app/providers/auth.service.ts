import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';
import {LOGIN_URL} from "./url-paths";
import {HttpOptionsService} from "./http-options.service";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
	
	constructor(
		private http: HttpClient,
    private httpOptionsService: HttpOptionsService, private router: Router) { }
	
	userAuthenticationChanges = new Subject();
	private _isAuthenticated = false;
	private _redirectUrl = '';
	logedInUser: {
		creationDate: string,
		id: string;
		name: string;
		role: string[],
	} = null;
 
	get redirectUrl(): string {
		const temp = this._redirectUrl;
		this._redirectUrl = '';
		return temp;
	}
	
	userIsAdmin() {
		const roles = this.getUserRoles();
		if (roles) {
			return roles.includes('admin');
		}
		return false;
	}
	
	getUserRoles() {
		try {
			return this.logedInUser.role;
		}catch (e) {
			console.error(e);
		}
		
	}
	
	set redirectUrl(url: string) {
		this._redirectUrl = url;
	}

  get userIsAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  set userIsAuthenticated(value: boolean) {
    this._isAuthenticated = value;
    if (this.redirectUrl !== '') {
    	this.router.navigate([this.redirectUrl]);
    }
	  this.userAuthenticationChanges.next(value);
  }
  
	deleteToken() {
  	localStorage.removeItem('token');
	}
	
	createUser(user: {name: string, password: string, email: string}) {
  	const httpOptions = this.httpOptionsService.getHttpOptions();
  	this.http.post(environment.apiUrl +'auth/signup', {user}, httpOptions).subscribe( resp => {
  		this.handleResponse(resp);
	  });
	}
	
	handleResponse(response) {
  	console.log('handle response', response);
		if (response['tokenIsValid']) {
			this.userIsAuthenticated = response['tokenIsValid'];
		} else if (response['accessToken']) {
			this.userIsAuthenticated = true;
			this.setToken(response['accessToken']);
		} else { // delete invalid token from local storage
			this.deleteToken();
		}
		if (response['_user']) {
			this.logedInUser = response['_user'];
		}
	}
	
	async loginWithToken() {
    return new Promise((resolve, reject) => {
	    const token = this.httpOptionsService.getAuthToken();
	    if (token !== '') {
		    const httpOptions = this.httpOptionsService.getHttpOptions();
		    const body = {token};
		    this.http.post(LOGIN_URL + '/withtoken', body, httpOptions).subscribe(
			    resp => {
			    	this.handleResponse(resp);
				    resolve(resp['tokenIsValid']);
			    },
			    error => {
				    console.error(error);
			    }
		    );
	    } else {
	      reject(new Error('No token! Cant log in.'));
      }
    });
  }
	
  setToken(token) {
    localStorage.setItem('token', token);
  }
  
  logout() {
    localStorage.removeItem('token');
    this.userIsAuthenticated = false;
    this.userAuthenticationChanges.next(this.userIsAuthenticated);
  }
  
  login(withData: {credentials: string, password: string}) {
    return new Promise( (res, rej) => {
      const user: {credentials: string, password: string} = withData;
      const httpOptions = this.httpOptionsService.getHttpOptions();
      
      this.http.post(LOGIN_URL, user, httpOptions).subscribe( resp => {
      	console.log('resp on login: ', resp);
        if (resp['token']) {
          this.setToken(resp['token']['accessToken']);
          this.userIsAuthenticated = true;
          res(true);
        }
        if (resp['_user']) {
        	this.logedInUser = resp['_user'];
        }
      }, error => {
        rej(false);
      });
    });
  }
	
}
