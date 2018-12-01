import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { catsProviders } from './cats.providers';
import { MongooseModule } from '@nestjs/mongoose';
import {CatSchema} from "./schemas/cat.schema";

@Module({
	imports: [ MongooseModule.forFeature([{ name: 'Cat', schema: CatSchema }])],
	controllers: [CatsController],
	providers: [
		CatsService,
		...catsProviders,
	],
})
export class CatsModule {}