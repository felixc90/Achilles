import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName('help')
	.setDescription('Shows the list of commands that can be used')

export async function execute(interaction: CommandInteraction) {
	const helpEmbed = new EmbedBuilder()
	.setColor('#0099ff')
	.setTitle(`Achilles Bot Help`)
	.addFields(
			{'name' : '💯 Register User - `/register`', 'value': 'Registers the user to the server competition.', 'inline': false},
			{'name' : '🛑 Deregister User - `/deregister`', 'value': 'Deregisters the user\'s from the server competition.', 'inline': false},
			{'name' : '🏃‍♂️ Athlete Profile - `/profile`', 'value': 'Shows athlete profile and some quick statistics.', 'inline': false},
			{'name' : '👟 Graph - `/graph <period> <n> <name>`', 'value': 'Displays a graph of specified users\' activities for the last n periods.', 'inline': false},
			{'name' : '🚀 Leaderboard - `/leaderboard`', 'value': 'Displays the weekly Strava leaderboard based on distance.', 'inline': false},
	)
	await interaction.reply({embeds : [helpEmbed]})
}