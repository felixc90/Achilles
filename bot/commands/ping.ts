import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Guild, User } from "../models";
import { StravaService } from "../services/strava";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export async function execute(interaction: CommandInteraction) {

	const user = await User.findById(interaction.user.id);
	const stravaApi = new StravaService(user?.accessToken);

	stravaApi.getAthleteActivities();


  return interaction.reply("Pong!");
}