import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Guild, User } from "../../db";
import { StravaService } from "../services/strava";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export async function execute(interaction: CommandInteraction) {

	const user = await User.findById(interaction.user.id);
	const stravaApi = new StravaService(user?.accessToken);

	const data = await stravaApi.getAthleteActivities();
	console.log(data);

  return interaction.reply("Pong!");
}