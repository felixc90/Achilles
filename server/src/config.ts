import dotenv from "dotenv";

dotenv.config();

const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, MONGODB_CONNECT } = process.env;

if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET || !MONGODB_CONNECT) {
  throw new Error("Missing environment variables");
}

export const config = {
  STRAVA_CLIENT_ID,
  STRAVA_CLIENT_SECRET,
	MONGODB_CONNECT
};