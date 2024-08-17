import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { deployCommands } from "../deploy-commands";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!")

export async function execute(interaction: CommandInteraction) {
	// TODO: remove, testing only
  return interaction.reply('Pong!');
}