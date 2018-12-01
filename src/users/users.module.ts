import { Module } from '@nestjs/common';
import {UsersService} from "./users.service";
import {UsersController} from "./users.controller";
import {User} from "./user.schema";
import {Text} from "./../text/text.schema";
import { MongooseModule } from '@nestjs/mongoose';
import {DatabaseModule} from "../database/database.module";
import {JwtModule} from "@nestjs/jwt";
import {jwtSecretKey} from "../constans/constans";

@Module({
	imports: [
		MongooseModule.forFeature([User, Text]),
		DatabaseModule,
		JwtModule.register({
			secretOrPrivateKey: jwtSecretKey,
			signOptions: {
				expiresIn: 3600,
			},
		}),
	],
	controllers: [UsersController],
	providers: [
		UsersService,
	],
	exports: [UsersService],
})
export class UsersModule{}