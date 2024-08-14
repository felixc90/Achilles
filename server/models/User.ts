import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
	_id: String,
	firstName: String,
	lastName: String,
	profile: String,
	accessToken: {
		accessToken: String,
		refreshToken: String,
		expiresAt: Number,
		expiresIn: Number,
		tokenType: String,
	}
});

export default mongoose.model('User', schema);