import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { GuildService } from "../services";
import { errorMessage } from "../utils/error";
import { LeaderboardUser, IGuild } from '../types';
import { DateHelper } from "../utils/date-helper";

const pageSize = 5;

export const data = new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("Displays the weekly leaderboard!");

export async function execute(interaction: CommandInteraction) {
	if (!interaction.guildId) return interaction.reply(errorMessage);

	const guildService = new GuildService(interaction.guildId);
	const data = await guildService.getWeeklyTopUsers();

	const { embed, row } = createLeaderboard(data, interaction.guild?.iconURL() ?? undefined);

	return interaction.reply({
		embeds: [embed],
		components: [row]
	})
}

export function createLeaderboard(
	data: LeaderboardUser[], 
	guildIcon: string | null | undefined, 
	weekStarting: Date = DateHelper.getStartOfWeek(),
	pageNumber: number = 1
) {
	const embed = new EmbedBuilder();
	embed.setTitle('Leaderboard');
	embed.setDescription(`Week starting ${weekStarting.toDateString()}`)
	embed.setColor('#05CBE1')
	embed.setFooter({ text: `\u200b\n Page ${pageNumber}` });
	embed.setTimestamp();
	embed.setThumbnail(guildIcon ? guildIcon : 'https://i.imgur.com/xJXLhW3.png');

	const fields = data.length > 0 ? data.map((user, i) => toEmbedField(user, i)).slice(
		(pageNumber - 1) * pageSize, pageNumber * pageSize
	) : [{ name: 'No data to be shown 👻!', value: '' }] ;
	embed.addFields(fields);

	const row = new ActionRowBuilder<ButtonBuilder>();
	const prevButton = new ButtonBuilder()
		.setCustomId('prev-page')
		.setLabel('Prev Page')
		.setStyle(ButtonStyle.Danger)
		.setDisabled(pageNumber === 1)
	
	const nextButton = new ButtonBuilder()
		.setCustomId('next-page')
		.setLabel('Next Page')
		.setStyle(ButtonStyle.Success)
		.setDisabled(pageNumber >= data.length / pageSize)

	row.addComponents(prevButton, nextButton);

	return { embed, row };
}

function toEmbedField(user: LeaderboardUser, index: number) {
	const fullName = (user.firstName + ' ' + user.lastName).trim();
	const username = user.username ? `(${user.username})` : '';
	const distance = user.distance / 1000;

	return {
		name: `${ordinal(index + 1)}`,
		value: `${distance.toFixed(1)}km | ${fullName} ${username}`,
		inline: false
	}
}

function ordinal(n: number) {
	if (n <= 3) {
			const medals = ['\u200b\n🥇','🥈','🥉'];
			return medals[n - 1];
	}
	var s = ["th", "st", "nd", "rd"];
	var v = n % 100;
	return n + (s[(v - 20) % 10] || s[v] || s[0]);
}