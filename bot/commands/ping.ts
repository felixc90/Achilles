import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Guild, User } from "../../db";
import { UserService } from '../services/user';
import { StravaService } from '../services/strava';
import { GuildService } from '../services/guild';
import { IGuild } from "../types";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export async function execute(interaction: CommandInteraction) {
	const guild = await Guild.findById(interaction.guildId);

	if (!guild) return interaction.reply("Png!");

	const guildService = new GuildService(guild as IGuild);

	guildService.getWeeklyTopUsers();

  return interaction.reply("Pong!");
}