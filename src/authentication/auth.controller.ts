import {Body, Controller, Get, Post, Res, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {JwtPayload} from "./interfaces/jwt-payload.interface";
import { ExtractJwt} from 'passport-jwt';
import {UsersService} from "../users/users.service";


@Controller('auth')
export class AuthController {
	
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService) {}
	
	@Get('token')
	async createToken(forUser): Promise<any> {
		// sends token to client
		return await this.authService.createToken(forUser);
	}
	
	
	@Post('login')
	async login(@Body() user: {credentials: string, password: string}, @Res() response){
		const payload = await this.authService.login(user);
		if (payload) {
			await this.usersService.updateLoginDate(user.credentials);
			response.status(200);
			response.send(payload);
		} else {
			response.status(401);
			response.send({});
		}
	}
	
	@Post('login/withtoken')
	async verifyToken(@Body('token') token) {
		const _user = await this.authService.validateToken(token)
			.catch(error => {
				console.error(error.name);
				return false;
			});
		if (_user) {
			await this.usersService.updateLoginDate(_user['name']);
			return {tokenIsValid: true, message: '', _user};
		} else {
			return {tokenIsValid: false, message: '', _user: null};
		}
	}
	
	@Post('signIn')
	async signIn(@Body() user: JwtPayload, @Res() response) {
	
	}
	
	@Get('data')
	@UseGuards(AuthGuard('jwt'))
	findAll() {
		return {message: 'OK'};
	}
	
	@Post('signup')
	async signUp(@Body('user') user, @Res() response) {
		const payload = await this.usersService.createUser({
			name: user.name,
			password: user.password,
			role: ['user'],
			email: user.email,
		})
		.then( newUser => {
			this.authService.createToken({
				name: newUser['name'],
				id: newUser._id,
				creationDate: newUser.creationDate,
				role: newUser['role'],
			})
			.then(token => {
				response.status(200);
				response.send(token);
			});
		})
		.catch(error => {
				response.status(409);
				response.send(error);
		});
	}
}