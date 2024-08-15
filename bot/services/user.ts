import { config } from "../config";
import { AccessToken, Activity,  } from "../types";
import { StravaService } from "./strava";
import { Run } from '../../db';

export class UserService {

	public async saveAthleteRuns(accessToken: AccessToken) {
		const stravaService = new StravaService(accessToken);
		const activities: Activity[] = await stravaService.getAthleteActivities();

		// TODO: filter only recent runs and not those already in db
		// TODO: intermittently fails due to long wait time
		const bulkRuns = activities
			.filter(a => a.type === "Run")
			.map(run => {
				const newRun = new Run({
					_id: run.id,
					athleteId: run.athlete.id,
					name: run.name,
					distance: run.distance,
					movingTime: run.moving_time,
					elapsedTime: run.elapsed_time,
					totalElevationGain: run.total_elevation_gain,
					startDate: run.start_date,
					startDateLocal: run.start_date_local,
					timezone: run.timezone,
					utcOffset: run.utc_offset,
					startLatlng: run.start_latlng,
					endLatlng: run.end_latlng,
					location: {
						city: run.location_city,
						state: run.location_state,
						country: run.location_country
					}
				});
				
				return {
					updateOne: {
						filter: { _id: newRun._id },
						update: { $set: newRun },
						upsert: true
					}
				}
			})

		await Run.bulkWrite(bulkRuns);
	}

}