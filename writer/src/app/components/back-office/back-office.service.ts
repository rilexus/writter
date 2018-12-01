import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {UserListEntry} from "./users-list/interfaces/user-list-entry";
import {HttpOptionsService} from "../../providers/http-options.service";

@Injectable({
	providedIn: 'root'
})
export class BackOfficeService {
	constructor(private http: HttpClient, private httpOptionsService: HttpOptionsService) { }
	
	async fetchAllUsers() {
		return new Promise((resolve, rej) => {
			const options = this.httpOptionsService.getHttpOptions();
			this.http.get(environment.apiUrl + 'backoffice/allUsers', options)
			.subscribe(
				(userListData: UserListEntry) => {
					console.log(userListData);
					resolve(userListData);
				},
				error => {
					console.error(error);
				}
			);
		});
	}
	
	async searchUser(name: string) {
		const httpOptions = this.httpOptionsService.getHttpOptions();
		return new Promise((resolve => {
			this.http.post(environment.apiUrl + 'backoffice/searchuser', {name: name}, httpOptions)
			.subscribe(users => {
				resolve(users);
			}, error => {
				console.error(error);
			});
		}));
		
	}
	
	deleteUser(user) {
	  const httpOptions = this.httpOptionsService.getHttpOptions();
	  this.http.put(environment.apiUrl + 'backoffice/deleteuser', {id: user._id}, httpOptions)
    .subscribe(
      (res) => {
        console.log(res);
      },
        error => {
	        console.error(error);
        }
     );
  }
}
