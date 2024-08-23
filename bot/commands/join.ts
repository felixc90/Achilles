import { CommandInteraction, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { config } from "../config";
import { Guild, User } from "../../db";

export const data = new SlashCommandBuilder()
	.setName('join')
	.setDescription('Join the leaderboard by linking your Strava account!');

export async function execute(interaction: CommandInteraction) {

	const user = await User.findOne({ _id : interaction.user.id });
	if (user) {
		const guild = await Guild.findOne({ _id : interaction.guildId });
		if (guild && !guild.members.includes(interaction.user.id)) {
			guild.members.push(interaction.user.id);
			await guild.save();
			return interaction.reply(`Joined ${interaction.guild?.name}'s leaderboard!`);
		} else {
			return interaction.reply(`Already joined ${interaction.guild?.name}'s leaderboard!`);
		}
	}
	
	const authUrl = new URL("https://www.strava.com/oauth/authorize");

	let redirectUri = config.STRAVA_REDIRECT_URI;
	redirectUri += `/${interaction?.guild?.id ?? ''}`
	redirectUri += `/${interaction?.user?.id ?? ''}`
	redirectUri += `/${interaction?.user?.username ?? ''}`

	const params = {
		response_type: 'code',
		client_id: config.STRAVA_CLIENT_ID,
		redirect_uri: redirectUri,
		approval_prompt: 'force',
		scope: 'activity:read',
	}

	authUrl.search = new URLSearchParams(params).toString();

	const button = new ButtonBuilder()
		.setLabel('Link Strava')
		.setURL(authUrl.toString())
		.setStyle(ButtonStyle.Link)

	const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(button);

	await interaction.reply({
		content: 'Link your Strava account with Achilles with the following link', 
		components: [row], 
		ephemeral: true
	});
}