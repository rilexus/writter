import * as mongoose from 'mongoose';
import {Schema} from "mongoose";

export const TextSchema = new mongoose.Schema({
	confData: {
		creationData: String,
		editData: String,
		fontFamily: String,
		id: Number,
		fontSize: Number,
	},
	value: String,
});

export const Text: {name: string, schema: Schema} = {name: 'text', schema: TextSchema};