import { ActionRowBuilder, CommandInteraction, SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandStringOption, SlashCommandUserOption, UserSelectMenuBuilder } from "discord.js";
import { errorMessage } from "../utils/error";

export const data = new SlashCommandBuilder()
  .setName("graph")
  .setDescription("Displays a graph showing run history!")
	.addStringOption(
		new SlashCommandStringOption()
			.setName('period')
			.setDescription('Choose time period')
			.setRequired(true)
			.addChoices(
				{ name: 'day', value: 'day' },
				{ name: 'week', value: 'week' }
			))
		.addIntegerOption(
			new SlashCommandIntegerOption()
				.setName("count")
				.setDescription("How many periods")
				.setMinValue(0)
		)
		.addUserOption(
			new SlashCommandUserOption()
				.setName('user')
				.setDescription('Add a user to compare against')
		)

export async function execute(interaction: CommandInteraction) {
	return interaction.reply('graph!');
}