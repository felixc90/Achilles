import { Guild, Run, User } from "../../db";
import { AggregatedRun, IUser } from "../types";
import { LeaderboardUser } from "../types/user";
import { DateHelper } from '../utils/date-helper';
import { UserService } from './user';

export class GuildService {
	public constructor(private guildId: string) {};

	public async getWeeklyTopUsers(weekDate = new Date()): Promise<LeaderboardUser[]> {
		const guild = await Guild.findById(this.guildId, 'members');

		const getOperations = guild?.members?.map(async (memberId: string) => {
			return await User.findById(memberId);
		});
		
		if (!getOperations) return [];
		const usersData = await Promise.all(getOperations);
		const users = usersData.filter(user => user != null)

		const athleteIds = users
			.map((user: IUser) => user.athleteId);

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
		users.forEach(user => userMap.set(user.athleteId, user.toObject()));
		return res.map(leaderboardUser => { 
			return {
				...leaderboardUser,
				...userMap.get(leaderboardUser._id)
			}
		});
	}

	public async syncAll() {
		const guild = await Guild.findById(this.guildId, 'members');

		const saveOperations = guild?.members?.map(async (userId: string) => {
			const userService = new UserService(userId);
			return userService.saveAthleteRuns();
		});

		if (!saveOperations) return 0;

		const numSaved = await Promise.all(saveOperations);

		return numSaved.reduce((a, b) => (a ?? 0) + (b ?? 0));
	}
}