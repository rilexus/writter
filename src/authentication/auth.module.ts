import { Module } from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import {jwtSecretKey} from "../constans/constans";
import {AuthController} from "./auth.controller";


@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			secretOrPrivateKey: jwtSecretKey,
			signOptions: {
				expiresIn: 3600,
			},
		}),
		UsersModule,
	],
	controllers: [
		AuthController,
	],
	providers: [
		AuthService,
		JwtStrategy,
		// UsersService
	],
	exports: [],
})
export class AuthModule {}