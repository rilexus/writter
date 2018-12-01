import {HttpModule, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {APP_FILTER} from '@nestjs/core';
import {NotFoundExceptionFilter} from './filters/NotFoundExeptionFilter';
import {UsersModule} from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import {DB_URL} from "./constans/constans";
import {DatabaseModule} from "./database/database.module";
import {BackOfficeModule} from "./backoffice/back-office.module";
import {AuthModule} from "./authentication/auth.module";



@Module({
  imports: [
  	// TextsModule,
	  UsersModule,
	  DatabaseModule,
	  HttpModule,
	  BackOfficeModule,
	  MongooseModule.forRootAsync({
		  useFactory: () => ({
			  uri: DB_URL,
		  }),
	  }),
	  AuthModule,
  ],
  controllers: [
  	AppController,
  ],
  providers: [
	  AppService,
	  {
		  provide: APP_FILTER,
		  useClass: NotFoundExceptionFilter, // return always the index.html in case of 404 (page not found/unknown url)
	  },
  ],
})
export class AppModule {}
