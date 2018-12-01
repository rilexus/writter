import {Injectable, Res} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import {jwtSecretKey, tokenExpirationTime} from "../constans/constans";
import {UsersService} from "../users/users.service";


@Injectable()
export class AuthService {
	constructor(private readonly usersService: UsersService) {}
	
	// async signIn(): Promise<string> {
	// 	const user: JwtPayload = { credentials: 'testUserName', password: '42' };
	// 	return jwt.sign(user, jwtSecretKey, { expiresIn: tokenExpirationTime });
	// }
	
	async createToken(forUser: JwtPayload): Promise<{expiresIn: number, accessToken: string}> {
		return new Promise<{expiresIn: number, accessToken: string}> ((res, rej) => {
			const accessToken = jwt.sign(forUser, jwtSecretKey, { expiresIn: tokenExpirationTime });
			res({
				expiresIn: tokenExpirationTime,
				accessToken,
			});
		});
	}
	
	async decodeToken(token) {
		return new Promise<boolean>((res, rej) => {
			jwt.verify(token, jwtSecretKey, (err, decoded) => {
				if (err) {
					rej(err);
				} else {
					res(decoded);
				}
			}) ;
		});
	}
	
	validateUser(payload){
		return {};
	}
	
	async validateToken(token) {
		return new Promise((res, rej) => {
			jwt.verify(token, jwtSecretKey, (err, decoded) => {
				if (err) {
					rej(err);
				} else {
					res(decoded);
				}
			}) ;
		});
	
	}
	
	// async tokkenIsValid(token): Promise<boolean>{
	// 	return new Promise<boolean>((res, rej) => {
	// 		jwt.verify(token, SECRET_KEY, (err, decoded) => {
	// 			if (err) {
	// 				rej(err);
	// 			} else {
	// 				res(true);
	// 			}
	// 		}) ;
	// 	});
	// }
	
	async login(user: {credentials: string, password: string}) {
		// console.log('validate user: ', user);
		const userIsValidated = await this.validateCredentials(user.credentials, user.password);
		const userModel = await this.usersService.findOneByName(user.credentials);
		
		if (userIsValidated && userModel) {
			const _user = {
				name: userModel.name,
				id: userModel._id,
				creationDate: userModel.creationDate,
				role: userModel.role,
			};
			const token = await this.createToken(_user);
			return {token, _user};
		} else {
			return false;
		}
	}
	
	async validateCredentials(credentials: string, password: string) {
		console.log('validate user: ', credentials, password);
		const userModel = await this.usersService.findOneByName(credentials);
		if (userModel) {
			const passwordIsValid = await userModel.comparePassword(password);
			return passwordIsValid;
		}
		return false;
	}
}