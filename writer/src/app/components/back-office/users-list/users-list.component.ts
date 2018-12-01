import { Component, OnInit } from '@angular/core';
import {BackOfficeService} from "../back-office.service";
import {UserListEntry} from "./interfaces/user-list-entry";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  constructor(private backOfficeService: BackOfficeService) { }
  users: UserListEntry[] = [];
  userActions = ['Delete'];
  userHasSearched = false;
	
	onListElementAction($event, onUser: UserListEntry) {
		switch ($event) {
			case 'Delete': {
				this.removeUser(onUser);
				// if last user in the list was removed, load more users
				if (this.users.length === 0) {
					this.searchUserByNamePart('');
				}
				break;
			}
		}
  }
	
  removeUser(user) {
	  const index = this.users.findIndex((userInList) => userInList._id === user._id);
	  if (index !== -1) {
	     this.users.splice(index, 1);
	     this.backOfficeService.deleteUser(user);
    }
  }
	
  setUsers(users: UserListEntry[]) {
		this.users = users;
  }
  
  fetchUsers() {
	  this.backOfficeService.fetchAllUsers().then((users) => {
	  	this.setUsers(users as UserListEntry[]);
	  });
  }
  
  searchUserByNamePart(name: string) {
	  this.backOfficeService.searchUser(name)
	  .then((users) => {
			  this.setUsers(users as UserListEntry[]);
	  })
	  .catch(error => {console.error(error)});
  }
  
  ngOnInit() {
    this.fetchUsers();
  }

}
