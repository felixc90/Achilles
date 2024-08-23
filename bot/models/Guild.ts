import mongoose, { Document, Schema } from 'mongoose';

export interface IGuild extends Document {
  _id : string,
	name : string,
	members: string[]
};

export const GuildSchema = new Schema({
  _id : String,
	name : String,
	members: {
		type: [String],
		default: []
	}
});

export const Guild = mongoose.model<IGuild>('Guild', GuildSchema);