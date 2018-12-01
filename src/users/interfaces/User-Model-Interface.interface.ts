import { Document } from 'mongoose';

export interface UserModelInterface extends Document {
	name: string;
	password: string;
	readonly texts: any[];
	lastLogin: string;
	creationDate: string;
	role: string[];
	email: string;
	updateLoginDate(): void;
	comparePassword(passwordCandidate: string);
}
