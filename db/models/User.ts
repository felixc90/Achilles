import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
	_id: String,
	athleteId: String,
	firstName: String,
	lastName: String,
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

export default mongoose.model('User', schema);