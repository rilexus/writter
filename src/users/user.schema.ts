import {Text} from "../text/text.schema";
import mongoose, {Schema} from "mongoose";
import * as bcrypt from 'bcrypt';

const UserSchema = new Schema({
	name: {
		unique : true,
		type: String,
		validate: {
			validator: (name) => name.length > 2,
			message: (props) => 'Name must be at least 2 character long!',
		},
		required: [true, 'User name is required!'],
	},
	texts: [{type: Schema.Types.ObjectId, ref: Text.name}],
	creationDate: String,
	email: {
		type: String,
		required: [true, 'User name is required!'],
	},
	lastLogin: String,
	password: String,
	role: [String],
});

UserSchema.virtual('textCount').get(function() {
	return this.texts.length;
});

// hash password on new user save
UserSchema.pre('save', function(next) {
	next();
});

UserSchema.methods.comparePassword = function(candidatePassword) {
	return new Promise((resolve, reject) => {
		const user = this;
		console.log(user.name);
		console.log(user.password);
		const password = user['password'];
		
		bcrypt.compare(candidatePassword, password)
			.then(isMatch => {
				resolve(isMatch);
			})
			.catch(err => {
				reject(err);
			});
	});
};

UserSchema.pre('remove', function(next){
	const TextModel = mongoose.model('text');
	// const user = this;
	// TextModel.remove({_id: {$in: user.texts}}).then( () => {
	// 	console.log('Texts removed from User');
	// });
	next();
});

export const User: {name: string, schema: Schema} = {name: 'user', schema: UserSchema};