import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  
  root(): string {
    return 'as';
  }
	
	
	async buildUsers(rawUsers) {
    
    if (rawUsers) {
      return new Promise(resolve => {
	      
        const usersArra = [];
	      rawUsers.forEach(rawUser => {
		      const user = this.buildUser(rawUser);
		      usersArra.push(user);
	      });
	      
	      resolve(usersArra);
      });
    }
  }
	
	private buildUser(user) {
    try{
	    const name = user.login.username as string;
	    const password = user.login.password as string;
	    const creationDate = user.registered.date as string;
	    const lastLogin = new Date().toDateString();
	    const role = ['user'];
	    const email = user.email as string;
	    const texts = [];
	
	    return {name, password, email, creationDate, lastLogin, role, texts};
    } catch (e) {
      console.error('AppService: buildUser', e);
    }
	}
}
