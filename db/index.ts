
import mongoose from "mongoose";
import Guild from "./models/Guild";
import User from "./models/User";
import dotenv from "dotenv";

dotenv.config();

const { MONGODB_CONNECT } = process.env;

mongoose.connect(MONGODB_CONNECT ?? '');

export {
	User,
	Guild
}