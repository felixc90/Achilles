import { CommandInteraction, SlashCommandBuilder, SlashCommandUserOption } from "discord.js";
import { UserService } from "../services";
import { errorMessage } from "../utils/error";

export const data = new SlashCommandBuilder()
  .setName("sync")
  .setDescription("Syncs a user's data with Strava [development only]")
	.addUserOption(
		new SlashCommandUserOption()
			.setName('user')
			.setDescription('Choose a user')
	)

export async function execute(interaction: CommandInteraction) {

	const user = interaction.options.get('user')?.user;
	const userId = user ? user.id : interaction.user.id;

	const userService = new UserService(userId);

	await interaction.deferReply();
	const res = await userService.saveAthleteRuns();
	
	if (res == -1) return await interaction.editReply(errorMessage);
	return await interaction.editReply(`Synced ${res} runs from Strava!`);
}