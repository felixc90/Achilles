import { CommandInteraction, SlashCommandBuilder, SlashCommandUserOption } from "discord.js";
import { GuildService, UserService } from "../services";
import { errorMessage } from "../utils/error";

export const data = new SlashCommandBuilder()
  .setName("sync")
  .setDescription("Syncs a user's data with Strava [development only]")
	.addUserOption(
		new SlashCommandUserOption()
			.setName('user')
			.setDescription('Choose a user to sync Strava data. Hint: choose Achilles to sync all')
	)

export async function execute(interaction: CommandInteraction) {
	if (!interaction.guildId) return interaction.reply(errorMessage);
	
	await interaction.deferReply();
	let res: number | null = 0;
	const user = interaction.options.get('user')?.user;
	const userId = user ? user.id : interaction.user.id;

	if (user?.bot && user?.username === 'Achilles') {
		const guildService = new GuildService(interaction.guildId);
		res = await guildService.syncAll();
	} else {
		const userService = new UserService(userId);
		res = await userService.saveAthleteRuns();
	}

	if (res == null) return await interaction.editReply(errorMessage);

	return await interaction.editReply(`Synced ${res} total runs from Strava!`);
}