
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { MONGODB_CONNECT } = process.env;

try {
	mongoose.connect(MONGODB_CONNECT ?? '');
	console.log('Database connected successfully');
} catch (error) {
	console.error('Database connection failed', error);
	process.exit(1);
}