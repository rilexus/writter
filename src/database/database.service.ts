import { Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import mongoose from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {userSeeds} from './userSeeds';
import {UserModelInterface} from '../users/interfaces/User-Model-Interface.interface';
import {TextModelInterface} from '../text/interfaces/Text.interface';
import {textSeeds} from "./textsSeeds";
import {UserSchemaInterface} from "../users/interfaces/user-schema.interface";
import {error} from "util";

@Injectable()
export class DatabaseService {
	constructor(
		@InjectModel('user') private readonly User: Model<UserModelInterface>,
		@InjectModel('text') private readonly Text: Model<TextModelInterface>) {}
	
	async saveUser(user: UserModelInterface) {
		return new Promise((res, rej) => {
			user.save().then(_user => {
				res(_user);
			})
			.catch(err => {
				// filters for error message
				rej(err.errmsg);
			});
		});
	}
	
	async getPassword(forUserId: string) {
		const user = await this.User.findById(forUserId);
		return user['password'];
	}
	
	async getUserWithName(name: string) {
		return this.User.findOne({name}).catch(err => {
			console.log('No user found with name: ' + name, err);
			return null;
		});
	}
	
	
	async searchForUserName(name: string) {
		return this.User.find(   { name: { $regex: name, $options: 'i' }});
	}
	
	async getUsersWithText() {
		return await this.User.find()
		.populate('texts');
	}
	
	async findeUserByName(name: string) {
		return this.User.findOne({name});
	}
	
	async deleteUser(id: string) {
		return this.User.findByIdAndRemove({_id: id});
		
	}
	
	async removeUser() {
		return await this.User.find({name: 'TestUser_1'}).remove();
	}
	
	async getAllData() {
		return this.getUserList();
	}
	async getUserList() {
		return await this.User.find(
			{},
			{
				name: 1,
				lastLogin: 1,
				creationDate: 1,
				role: 1,
				email: 1,
			});
	}
}