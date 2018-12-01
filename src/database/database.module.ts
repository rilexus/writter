import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {DatabaseService} from "./database.service";
import {User} from "../users/user.schema";
import {Text} from "../text/text.schema";


@Module({
	imports: [MongooseModule.forFeature([
		User,
		Text,
	])],
	providers: [DatabaseService],
	exports: [DatabaseService],
})
export class DatabaseModule{}