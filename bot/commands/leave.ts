import { CommandInteraction, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Guild } from "../../db";
import { errorMessage } from "../utils/error";

export const data = new SlashCommandBuilder()
	.setName('leave')
	.setDescription('Leave the leaderboard and remove your data from the server');

export async function execute(interaction: CommandInteraction) {
	const guild = await Guild.findById(interaction.guildId);
	if (!guild) return interaction.reply(errorMessage);

	if (!guild.members.includes(interaction.user.id)) {
		return interaction.reply({ content: `Already left ${interaction.guild?.name}'s leaderboard!`, ephemeral: true});
	}
	
	guild.members = guild.members.filter(member => member !== interaction.user.id);
	await guild.save();

	return interaction.reply({ content: `Left ${interaction.guild?.name}'s leaderboard!`, ephemeral: true});
}