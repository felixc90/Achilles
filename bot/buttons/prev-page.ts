import { ButtonInteraction } from "discord.js";
import { Button } from './button';
import { errorMessage } from "../utils/error";
import { GuildService } from "../services";
import { createLeaderboard } from "../commands/leaderboard";
import { LeaderboardHelper } from "../utils/leaderboard-helper";

export const PrevPageButton: Button = {
	customId: 'prev-page',
	execute: async (interaction: ButtonInteraction) => {
		
		if (!interaction.guildId) return interaction.reply(errorMessage);
		const guildService = new GuildService(interaction.guildId);

		const leaderboardEmbed = interaction.message.embeds.at(0);
		if (!leaderboardEmbed) return interaction.reply(errorMessage);

		const pageNumber = LeaderboardHelper.parsePageNumber(leaderboardEmbed);
		const week = LeaderboardHelper.parseWeekDate(leaderboardEmbed);

		const data = await guildService.getWeeklyTopUsers(week);
	
		const { embed, row } = createLeaderboard(data, interaction.guild?.iconURL(), week, pageNumber - 1);
	
		return interaction.reply({
			embeds: [embed],
			components: [row]
		})
	}
}