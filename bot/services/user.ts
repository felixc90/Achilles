import { AccessToken, Activity, AggregatedRun, Period } from "../types";
import { StravaService } from "./strava";
import { Run, User } from '../../db';
import { DateHelper } from "../utils/date-helper";

export class UserService {

	public constructor(private userId: string) {};

	// TODO: consider implementing properties
	public async getUsername() {
		const user = await User.findById(this.userId, 'username');
		console.log(user);
		if (!user) return 'Undefined';

		return user.username;
	}

	public async getAggregatedRuns(period: Period, count: number) {
		// TODO: maybe make a cache for this??
		const user = await User.findById(this.userId, 'athleteId');
		if (!user) return [];

		const boundaries = DateHelper.getStartOfPeriods(period, count + 1).map(d => d.toISOString());
		boundaries.push((new Date()).toISOString());

		const res = await Run.aggregate<AggregatedRun>([
			{
				$match:
				{ 
					athleteId : user.athleteId,
					startDateLocal : { $gte: boundaries[0] }
				}
			},
			{
				$bucket: {
					groupBy: "$startDateLocal",
					boundaries: boundaries,
					default: "Other",
					output: {
						"distance": { $sum: "$distance" },
						"time": { $sum: "$movingTime" },
					}
				}
			},
		])

		const allBoundaries = new Set(boundaries);
		res.forEach(aggRun => allBoundaries.delete(aggRun._id));
		allBoundaries.forEach(date => res.push({ _id: date, distance: 0, time: 0 }));
		return res.sort((a, b) => a._id.localeCompare(b._id)).slice(0, -1);
	}

	public async saveAthleteRuns(accessToken: AccessToken) {
		const stravaService = new StravaService(accessToken);
		const activities: Activity[] = await stravaService.getAthleteActivities();

		// TODO: filter only recent runs and not those already in db
		// TODO: enable adding of all runs
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