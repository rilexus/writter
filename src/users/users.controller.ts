import {Body, Controller, Get, Post, Res, UseGuards, Headers, Delete, Param} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {AuthGuard} from '@nestjs/passport';
import {JwtService} from "@nestjs/jwt";


@Controller('users')
export class UsersController {
	
	constructor(private userService: UsersService, private jwtService: JwtService) {}
	
	@Post('create')
	async create(@Res() response, @Body('user') user?: CreateUserDto) {
		// check if user with posted name does not exist
		const testUser = {name: 'some', password: 'abc'};
		// if (user) {
			const userInserted = await this.userService.insertInDB(testUser);
			if (userInserted) {
				response.send(userInserted);
			} else {
				response.status(422); // user already exist!
				response.send(new Error());
			}
		// }
	}
	
	
	@Get('texts')
	@UseGuards(AuthGuard('jwt'))
	async getUsersTexts(@Headers('authorization') token) {
		const user = this.jwtService.verify(token);
		const texts = await this.userService.getTexts(user.id);
		return texts;
		
	}
	
	@Delete('texts/delete/:textId')
	@UseGuards(AuthGuard('jwt'))
	async removeText(@Param('textId') textId, @Headers('authorization') token) {
		const jwtObject = this.jwtService.decode(token, {complete: true});
		return await this.userService.deleteText(jwtObject['payload']['id'], textId);
	}
	
	@Get('texts/create')
	@UseGuards(AuthGuard('jwt'))
	async createText(@Headers('authorization') token) {
		const user = this.jwtService.verify(token);
		const texts = await this.userService.createNewText(user.id);
		return texts;
		
	}
	
	@Post('texts/update')
	@UseGuards(AuthGuard('jwt'))
	async save(@Body() text) {
		return await this.userService.updateText(text);
	}
	
}