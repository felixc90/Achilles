import { Run, User, } from "../../db";
import { IGuild, IUser } from "../types";
import { LeaderboardUser } from "../types/user";
import { DateHelper } from '../utils/date-helper';

interface AggregatedRun {
	_id: string;
	distance: number;
	time: number;
}

export class GuildService {
	public constructor(private guild: IGuild) {};

	public async getWeeklyTopUsers(weekDate = new Date()): Promise<LeaderboardUser[]> {

		const getOperations = this.guild.members?.map(async (memberId: string) => {
			// TODO: make this bit more concise by adding a projection
			return await User.findById(memberId);
		});
		
		if (!getOperations) return [];

		const users = await Promise.all(getOperations);
		const athleteIds = users.map((user: IUser | null) => user && user.athleteId);

		const startOfWeek = DateHelper.getStartOfWeek(weekDate);
		const endOfWeek = DateHelper.getEndOfWeek(weekDate);

		const res = await Run.aggregate<AggregatedRun>([
			{
				$match:
				{ 
					athleteId : { $in: athleteIds },
					startDateLocal: { 
						$gte : startOfWeek.toISOString(),
						$lt : endOfWeek.toISOString()
					}
				} 
			},
			{
				$group:
				{
					_id: "$athleteId",
					distance: { $sum: "$distance" },
					time: { $sum: "$elapsedTime" }
				}
			},
			{ $sort : { distance : -1, time: 1 } },
			{ $limit : 10 }
		])

		const userMap = new Map<string, IUser>();
		users.forEach(user => user && userMap.set(user.athleteId, user.toObject()));
		return res.map(leaderboardUser => { 
			return {
				...leaderboardUser,
				...userMap.get(leaderboardUser._id)
			}
		});
	}
}