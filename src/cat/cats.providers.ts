import { Connection } from 'mongoose';
import { CatSchema } from './schemas/cat.schema';
import {catModelToken, dbConnectionToken} from "../constans/constans";

export const catsProviders = [
	{
		provide: catModelToken,
		useFactory: (connection: Connection) => connection.model('Cat', CatSchema),
		inject: [dbConnectionToken],
	},
];