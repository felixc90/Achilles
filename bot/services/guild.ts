
import { Run, User } from "../../db";
import { IGuild, IUser } from "../types";
import { DateHelper } from '../utils/dateHelper';

export class GuildService {
	public constructor(private guild: IGuild) {};

	public async getWeeklyTopUsers() {
		// TODO: typing is cooked here. Maybe put athleteIds in guild as well
		const getOperations = this.guild.members?.map(async m => {
			return await User.findById(m, 'athleteId');
		}) as Promise<IUser>[];

		const users = await Promise.all(getOperations);
		const athleteIds = users.map(user => user.athleteId);

		const res = await Run.aggregate([
			{
				$match:
				{ 
					athleteId : { $in: athleteIds },
					startDateLocal: { $gte : DateHelper.getStartOfWeek() }
				} 
			},
			{
				$group:
				{
					_id: "$athleteId",
					totalDistance: { $sum: "$distance" },
					totalTime: { $sum: "$elapsedTime" }
				}
			},
			{ $limit : 10 }
		])

		console.log(res);
	}
}