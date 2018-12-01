import { Injectable} from '@nestjs/common';
import {Model} from "mongoose";
import {JwtPayload} from "../authentication/interfaces/jwt-payload.interface";
import {CreateUserDto} from "./dto/create-user.dto";
import {UserModelInterface} from './interfaces/User-Model-Interface.interface';
import {InjectModel} from "@nestjs/mongoose";
import {DatabaseService} from "../database/database.service";
import {UserSchemaInterface} from "./interfaces/user-schema.interface";
import * as bcrypt from 'bcrypt';
import {TextModelInterface} from "../text/interfaces/Text.interface";


@Injectable()
export class UsersService {
	constructor(
		@InjectModel('user') private  User: Model<UserModelInterface>,
		@InjectModel('text') private  Text: Model<TextModelInterface>,
		private databaseService: DatabaseService) {}
	
	async create(createUserDto: CreateUserDto): Promise<UserModelInterface> {
		const newUser = new this.User(createUserDto);
		return await newUser.save();
	}
	
	
	async findOneByToken(token: JwtPayload) {
	
	}
	
	async deleteText(userId: string, textId: string) {
		const deleted = await this.User.updateOne({_id: userId}, {$pull: {texts: {$in: textId}}});
		
		return deleted;
	}
	async getTexts(forUserId: string) {
		const user = await this.User.findOne({_id: forUserId}).populate('texts');
		return user.texts;
	}
	
	async updateText(text) {
		const updated = await await this.Text.updateOne(
			{_id: text._id},
			{$set:
				{
					confData: {
						editData: text.confData.editData,
						fontFamily: text.confData.fontFamily,
						fontSize: text.confData.fontSize,
					},
					value: text.value,
				}});
		return updated;
	}
	
	async createNewText(forUserWithId: string) {
		const newText = new this.Text(
			{
				confData: {
					creationData: new Date().toDateString(),
					editData: new Date().toDateString(),
					id: new Date().getTime(),
					fontFamily: 'Helvetica',
					fontSize: 16,
				},
				value: '<p><br></p>',
			},
		);
		const text = await newText.save();
		await this.User.updateOne({_id: forUserWithId}, {$push: {texts: text._id}})
		return text;
	}
	
	async insertInDB(createUserDto: CreateUserDto): Promise<boolean> {
		const userExist = await this.User.findOne({name: createUserDto.name});
		let userCreated;
		if (!userExist) {
			userCreated = await this.create(createUserDto);
		}
		return userCreated ? true : false;
	}
	
	async updateLoginDate(forUserName: string) {
		const date = new Date().toDateString();
		const time = new Date().toTimeString().slice(0, 8);
		const timeString = date + ' ' + time;
		return await this.User.updateOne(
			{name: forUserName},
			{$set: {lastLogin: timeString}});
	}
	
	private async encodePassword(password: string): Promise<string >{
		return new Promise<string>((resolve, reject) => {
			
			bcrypt.genSalt(10)
			.then(salt => {
				
				bcrypt.hash(password, salt)
				.then(hash => {
					resolve(hash);
				})
				.catch(err => {
					console.error(err);
				});
				
			})
			.catch((err) => {
				console.error(err);
			});
		});
	}
	
	async createUser(user: {name: string, password: string, role: string[], email: string}): Promise<UserModelInterface> {
		return new Promise<UserModelInterface>((res, rej) => {
			const date = new Date().toDateString();
			const time = new Date().toTimeString().slice(0, 8);
			const creationDate = date + ' ' + time;
			
			const textModel = new this.Text({
				confData: {
						creationData: new Date().toDateString(),
						id: new Date().getTime() + 2,
						editData: new Date().toDateString(),
						fontFamily: 'Lucida Sans Typewriter',
						fontSize: 16,
					},
					value: '<p>Test text</p>',
				});
			textModel.save()
				.then((text) => {
					const lastLogin = '---';
					
					const userModel = new this.User({
						name: user.name,
						password: user.password,
						creationDate: creationDate,
						lastLogin: lastLogin,
						texts: text._id,
						role: user.role,
						email: user.email,
					});
					this.encodePassword(userModel['password']).then(hashedPassword => {
						userModel['password'] = hashedPassword;
						
						this.databaseService.saveUser(userModel)
							.then( _user => {
								res(_user as UserModelInterface);
							})
							.catch(err => { rej(err); });
					});
				}).catch();
		});
	}
	
	async comparePassword(userName: string, passwordCandidat: string) {
		const user = await this.User.findOne({name: userName});
		return await user.comparePassword(passwordCandidat);
	}
	
	async getUserByNamePart(name: string) {
		return this.databaseService.searchForUserName(name);
	}
	
	async findOneByName(name: string) {
		return await this.databaseService.findeUserByName(name);
	}
	
	// async saveUser(user: UserModelInterface) {
	// 	return this.databaseService.saveUser(user);
	// }
	
	async deleteUser(id: string) {
		return this.databaseService.deleteUser(id);
	}
	
	async getAllUsers() {
		return this.databaseService.getUserList();
	}
	
	async decodeUsers(users) {
	
	}
	
	
	async seedDb(users) {
		if (users) {
			const savePromises = [];
			// drop user collection
			const res = await this.User.find();
			if (res.length > 0) {
				await this.User.collection.drop().catch(err => {
					console.error(err);
				});
			}
			const text = await this.Text.find();
			if (text.length > 0) {
				await this.Text.collection.drop().catch(err => {
					console.error(err);
				});
			}
			
			
			
			const testUser: UserSchemaInterface = {
				name: 'stanis',
				texts: [],
				creationDate: new Date().toDateString(),
				lastLogin: new Date().toDateString(),
				password: 'abc',
				email: 'stanip@hotmmail.de',
				role: ['admin', 'user'],
			};
			
			savePromises.push(this.createUser(testUser));

			// save passed users to DB
			users.forEach((user, index) => {
				const newUser = new this.User(user);
				
				savePromises.push(this.createUser(newUser)
				.catch(err => {
					console.error('seed users error: ', err);
				}));
			});
			
			return await Promise.all(savePromises);
		}
	}

}