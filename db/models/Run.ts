import mongoose, { Document, Schema } from 'mongoose';

export interface IRun extends Document {
  _id: string,
	athleteId: string,
	name: string,
	distance: number,
	movingTime: number,
	elapsedTime: number,
	totalElevationGain: number,
	startDate: string,
	startDateLocal: string,
	timezone: string,
	utcOffset: number,
	startLatlng: string,
	endLatlng: string,
	location: {
		city: string,
		state: string,
		country: string
	}
};

export const RunSchema = new Schema({
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

const Run = mongoose.model<IRun>('Run', RunSchema);
export default Run;