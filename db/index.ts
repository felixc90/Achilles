
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { MONGODB_CONNECT } = process.env;

// TODO: fix two database connections are being made
try {
	mongoose.connect(MONGODB_CONNECT ?? '');
	console.log('Database connected successfully');
} catch (error) {
	console.error('Database connection failed', error);
	process.exit(1);
}

export { Guild, GuildSchema, IGuild } from './models/Guild'; 
export { User, UserSchema, IUser } from './models/User'; 
export { Run, RunSchema, IRun } from './models/Run'; 