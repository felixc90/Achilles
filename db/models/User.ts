import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string,
	athleteId: string,
	firstName?: string,
	lastName: string,
	username: string,
	profile: string,
	accessToken: {
		accessToken: string
		refreshToken: string
		expiresAt: number
		expiresIn: number
		tokenType: string
	}
};

export const UserSchema = new Schema({
  _id: String,
	athleteId: { type: String, index: { unique: true } },
	firstName: String,
	lastName: String,
	username: String,
	profile: String,
	accessToken: {
		type: {
			accessToken: {
				type: String,
				required: true
			},
			refreshToken: {
				type: String,
				required: true
			},
			expiresAt: {
				type: Number,
				required: true
			},
			expiresIn: {
				type: Number,
				required: true
			},
			tokenType: {
				type: String,
				required: true
			},
		},
		required: true
	}
});

export const User = mongoose.model<IUser>('User', UserSchema);