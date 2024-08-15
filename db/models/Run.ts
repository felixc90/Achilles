import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
	_id: String,
	athleteId: String,
	name: String,
	distance: Number,
	movingTime: Number,
	elapsedTime: Number,
	totalElevationGain: Number,
	startDate: String,
	startDateLocal: String,
	timezone: String,
	utcOffset: Number,
	startLatlng: String,
	endLatlng: String,
	location: {
		city: String,
		state: String,
		country: String
	}
});

export default mongoose.model('Run', schema);