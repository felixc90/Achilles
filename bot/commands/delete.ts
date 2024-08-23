import { CommandInteraction, EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import { Guild, User } from "../models";
import { errorMessage } from "../utils/error";

export const data = new SlashCommandBuilder()
	.setName('delete')
	.setDescription('Delete your account from Achilles permanently')
	.addStringOption(
		new SlashCommandStringOption()
			.setName('confirm')
			.setDescription('Type your Discord username to confirm deletion')
			.setRequired(true)
	)

export async function execute(interaction: CommandInteraction) {
	const user = await User.findById(interaction.user.id);
	
	if (!user) return interaction.reply(`Error occurred: ${interaction.user.username} not registered to Achilles`)

	if (typeof interaction.options.get('confirm')?.value != 'string') {
		return interaction.reply(errorMessage);
	}

	const username = interaction.options.get('confirm')?.value as string;
	if (username === interaction.user.username) {
		const guilds = await Guild.find({members: {$elemMatch: {id: interaction.user.id}}})

		const saveOperations = guilds.map(g => {
			g.members = g.members.filter(member => member !== interaction.user.id);
			return g.save();
		})

		await Promise.all(saveOperations);
		await User.findByIdAndDelete(interaction.user.id);
		return interaction.reply({ content: `${interaction.user.username} successfully deleted from Achilles.`, ephemeral: true });
	} else {
		return interaction.reply({ content: `Error occurred: usernames do not match!`, ephemeral: true });
	}
}