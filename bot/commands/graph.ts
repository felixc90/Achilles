import { ActionRowBuilder, CommandInteraction, SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandStringOption, SlashCommandUserOption, UserSelectMenuBuilder } from "discord.js";
import { errorMessage } from "../utils/error";
import { UserService } from "../services";
import { Period } from "../types";

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
				.setRequired(true)
		)
		.addUserOption(
			new SlashCommandUserOption()
				.setName('user')
				.setDescription('Add a user to compare against')
		)

export async function execute(interaction: CommandInteraction) {
	if (
		typeof interaction.options.get('period')?.value != 'string' ||
		typeof interaction.options.get('count')?.value != 'number'
	) return;
	const period = interaction.options.get('period')?.value as Period;
	const count = interaction.options.get('count')?.value as number;
	const userId = interaction.options.get('user')?.value;

	const userService = new UserService(interaction.user.id);

	const data = await userService.getAggregatedRuns(period, count);
	
	console.log(data);
	return interaction.reply('graph!');
}