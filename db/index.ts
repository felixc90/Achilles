
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { MONGODB_CONNECT } = process.env;

mongoose.connect(MONGODB_CONNECT ?? '');

export {
	User,
	Guild,
	Run
} from './models';