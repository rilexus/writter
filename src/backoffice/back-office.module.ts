import { Module } from '@nestjs/common';
import {BackOfficeController} from "./back-office.controller";
import {UsersModule} from "../users/users.module";
import {UsersService} from "../users/users.service";
import {PassportModule} from "@nestjs/passport";
import {AuthModule} from "../authentication/auth.module";

@Module({
	imports: [
		UsersModule,
		AuthModule,
		// PassportModule.register({ defaultStrategy: 'jwt' }),
	],
	controllers: [BackOfficeController],
	providers: [UsersService],
})
export class BackOfficeModule{}