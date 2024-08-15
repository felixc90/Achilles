import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
	_id : String,
	name : String,
	members: {
		type: [String],
		default: []
	}
});

export default mongoose.model('Guild', schema);