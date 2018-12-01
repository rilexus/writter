import {Get, Controller, Res, Post, Body, Put, UseGuards} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {AuthGuard} from "@nestjs/passport";
import {RolesGuard} from "../authentication/roles.guard";
import {Roles} from "../authentication/roles.decorator";


@Controller('backoffice')
export class BackOfficeController {
	constructor(private userService: UsersService) {}
	
	
	@Get('allUsers')
	@Roles('admin', 'admin-super')
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	async returnAllUsers() {
		return await this.userService.getAllUsers();
	}
	
	@Put('deleteuser')
	async deleteUser(@Body('id') id: string, @Res() responce) {
		const deleted = await this.userService.deleteUser(id);
		if (deleted ) {
			responce.send(await this.userService.deleteUser(id));
		} else {
			responce.status(404);
			responce.send();
		}
	}
	
	@Post('searchuser')
	@UseGuards(AuthGuard('jwt'))
	async searchForUser(@Body('name') name: string, @Res() responce) {
		responce.send(await this.userService.getUserByNamePart(name));
	}
	
}
