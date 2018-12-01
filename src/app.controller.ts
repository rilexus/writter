import {Get, Controller, Res, HttpService} from '@nestjs/common';
import { AppService } from './app.service';
import * as path from "path";
import {DatabaseService} from "./database/database.service";
import {UsersService} from "./users/users.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly databaseService: DatabaseService,
              private readonly usersService: UsersService,
              private readonly http: HttpService) {}
	
	@Get()
	root(@Res() res): void { // serve angular at root url
		res.sendFile(path.resolve('./public/index.html'));
	}
	@Get('seed')
	async seedDb(@Res() res) {
		const rawUsers = await this.getDummyUsers(10);
		const users = await this.appService.buildUsers(rawUsers);
		
		await this.usersService.seedDb(users);
		const result = await this.databaseService.getAllData();
		// return {done: result};
		res.send({done: result});
	}
	
	async getDummyUsers(amount: number) {
  	return new Promise(resolve => {
		  this.http.get('https://randomuser.me/api/?results=' + amount).subscribe( users => {
			  resolve(users.data.results);
		  }, error => {
			  console.error(error);
		  });
	  })
  	
	}
	
	
}
