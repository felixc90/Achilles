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
	athleteId: { type: String, index: true },
	name: String,
	distance: Number,
	movingTime: Number,
	elapsedTime: Number,
	totalElevationGain: Number,
	startDate: { type: String, index: true },
	startDateLocal: { type: String, index: true },
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

export const Run = mongoose.model<IRun>('Run', RunSchema);