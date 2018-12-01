import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import {jwtSecretKey} from "../constans/constans";
import {JwtPayload} from "./interfaces/jwt-payload.interface";


@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}
	
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const roles = this.reflector.get<string[]>('roles', context.getHandler());
		
		if (!roles) {
			return false;
		}
		const request = context.switchToHttp().getRequest();
		const header = request.headers;
		const token = header.authorization;
		const decodedUser = await this.decodeToken(token);
		const hasRole = () => decodedUser.role.some((rol) => roles.includes(rol));
		return decodedUser && decodedUser.role && hasRole();
	}
	
	async decodeToken(token): Promise<JwtPayload> {
		return new Promise<JwtPayload>((res, rej) => {
			jwt.verify(token, jwtSecretKey, (err, decoded) => {
				if (err) {
					rej(err);
				} else {
					res(decoded);
				}
			}) ;
		});
	}
}