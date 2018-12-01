import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HttpOptionsService} from "./http-options.service";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private httpOptionService: HttpOptionsService) { }
	
	async post(url: string, body: Object) {
		return new Promise((resolve, reject) => {
			const headers = this.httpOptionService.getHttpOptions();
			this.http.post(url, body, headers).subscribe(
				response => { resolve(response); },
				error => { reject(error); }
			);
		});
	}
	
	delete(url: string): Promise<any> {
  	return new Promise((resolve, reject) => {
  		this.http.delete(url, this.httpOptionService.getHttpOptions()).subscribe(response => {
  			resolve(response);
		  }, error => {
  			reject(error);
			  });
	  });
	}
	
	async get(url) {
		return new Promise((resolve, reject) => {
			const headers = this.httpOptionService.getHttpOptions();
			this.http.get(url, headers).subscribe( response => {
				resolve(response);
			}, error => {
				reject(error);
			});
		});
	}
}
