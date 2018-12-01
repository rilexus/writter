import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../providers/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
	
	constructor(private authService: AuthService, private router: Router) {}
 
	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : boolean | Observable<boolean> | Promise<boolean> {
		
	  const url: string = state.url; // use to save the previous route for redirection
    return this.checkLogin(url);
  }
	
	
	checkLogin(url: string): boolean | Observable<boolean> | Promise<boolean> {
		if (this.authService.userIsAuthenticated) { return true; }
		
		// Store the attempted URL for redirecting
		this.authService.redirectUrl = url;
		this.router.navigate(['auth']);
		return false;
	}
	
	canActivateChild(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
		return this.canActivate(route, state);
	}
}
