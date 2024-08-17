import { ActionRowBuilder, CommandInteraction, SlashCommandBuilder, SlashCommandUserOption, UserSelectMenuBuilder } from "discord.js";
import { errorMessage } from "../utils/error";

export const data = new SlashCommandBuilder()
  .setName("graph")
  .setDescription("Create a new graph displaying run history!")
	.addUserOption(
		new SlashCommandUserOption()
			.setName('user')
			.setDescription('Add a user to compare against')
	)

export async function execute(interaction: CommandInteraction) {
	if (!interaction.guildId) return interaction.reply(errorMessage);

	const userSelect = new UserSelectMenuBuilder()
		.setCustomId('graph-user-select')
		.setPlaceholder(`Select user(s) for graph`)
		.setMinValues(1)
		.setMaxValues(4)


	const row = new ActionRowBuilder<UserSelectMenuBuilder>()
		.addComponents(userSelect);

  return interaction.reply({
		components: [row]
	});
}