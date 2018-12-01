import { Injectable } from '@angular/core';
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HttpOptionsService {

  constructor() { }
	
	getAuthToken() {
  	const token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
		return token;
	}
	
	getHttpOptions() {
		const token = this.getAuthToken();
		return {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				Authorization: token
			})
		};
	}
}
