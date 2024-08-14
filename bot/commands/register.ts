import { CommandInteraction, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { config } from "../config";
import { Guild, User } from "../../db";

export const data = new SlashCommandBuilder()
	.setName('register')
	.setDescription('Link your Strava account with Achilles!');

export async function execute(interaction: CommandInteraction) {
	const user = await User.findOne({ _id : interaction.user.id });
	if (user) {
		const guild = await Guild.findOne({ _id : interaction.guildId });
		if (guild && !guild.members.includes(interaction.user.id)) {
			guild.members.push(interaction.user.id);
			await guild.save();
			return interaction.reply(`Added to ${interaction.guild?.name} leaderboard!`);
		} else {
			return interaction.reply(`Already added to ${interaction.guild?.name} leaderboard!`);
		}
	}
	
	const authUrl = new URL("https://www.strava.com/oauth/authorize");

	let redirectUri = config.STRAVA_REDIRECT_URI;
	redirectUri += `/${interaction?.guild?.id ?? ''}`
	redirectUri += `/${interaction?.user?.id ?? ''}`

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
		content:'Register your Strava account with Achilles with this one-time link', 
		components: [row], 
		ephemeral: true
	});
}