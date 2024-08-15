import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import {  } from "../types";
import { Guild } from "../../db";
import { GuildService } from "../services";
import { errorMessage } from "../utils/errorMessage";
import { LeaderboardUser, IGuild } from '../types';

const pageSize = 5;

export const data = new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("Displays the weekly leaderboard!");

export async function execute(interaction: CommandInteraction) {
	const guild = await Guild.findById(interaction.guildId);

	if (!guild) return interaction.reply(errorMessage);

	const guildService = new GuildService(guild as IGuild);
	const data = await guildService.getWeeklyTopUsers();

	addSeedData(data);

	const leaderboard = createLeaderboard(data, interaction.guild?.iconURL() ?? undefined);

	return interaction.reply(leaderboard);
}

function createLeaderboard(data: LeaderboardUser[], guildIcon?: string, pageNumber = 1) {
	const embed = new EmbedBuilder();
	embed.setTitle('Weekly Leaderboard');
	embed.setColor('#05CBE1')
	embed.setFooter({ text: `\u200b\n Page ${pageNumber}` });
	embed.addFields(data.map((user, i) => toEmbedField(user, i)))
	embed.setTimestamp();
	embed.setThumbnail(guildIcon ? guildIcon : 'https://i.imgur.com/xJXLhW3.png');

	const row = new ActionRowBuilder<ButtonBuilder>();

	const prevButton = new ButtonBuilder()
		.setCustomId('prev-page')
		.setLabel('Prev Page')
		.setStyle(ButtonStyle.Danger)
		.setDisabled(pageNumber === 1)
	
	const nextButton = new ButtonBuilder()
		.setCustomId('next-page')
		.setLabel('Next Page')
		.setStyle(ButtonStyle.Success)
		.setDisabled(pageNumber === data.length / pageSize)
	
	row.addComponents(prevButton, nextButton);

	return {
    embeds: [embed],
    components: [row]
  }
}

function addSeedData(data: LeaderboardUser[]) {
  const names = ["Cornflower Blue", "Green Yellow", "Moccasin", "Steel Blue", "Medium Slate Blue", "Light Green", "Medium Sea Green", "Slate Blue", "Thistle", "Light Pink", "Medium Purple", "Turquoise", "Lawn Green", "Light Goldenrod Yellow", "Honeydew", "Olive", "Lime", "Purple", "Beige", "Pale Turquoise", "Navajo White", "Sienna", "Midnight Blue", "Gray", "Deep Pink", "Dark Slate Gray", "Medium Spring Green", "Violet", "White Smoke", "Hot Pink", "Floral White", "Goldenrod", "Dark Violet", "Misty Rose", "Coral", "Snow", "Amethyst", "Fire Brick", "Dodger Blue", "Indian Red", "Sandy Brown", "Dark Sea Green", "Black", "Blue", "Lavender", "Medium Slate Blue", "Aquamarine", "Orange Red", "Light Coral", "Slate Gray", "Rosy Brown", "Powder Blue", "Dark Magenta", "Sea Green", "Light Sky Blue", "Green", "Burly Wood", "Bisque", "Gold", "Crimson", "Dark Slate Blue", "Medium Violet Red", "Aqua", "Dark Goldenrod", "Light Salmon", "Plum", "Teal", "Orange", "Dark Orchid", "Linen", "Pale Violet Red", "Light Sea Green", "Old Lace", "Chocolate", "Peach Puff", "Orchid", "Red", "Medium Aquamarine", "Gainsboro", "Khaki", "Pale Goldenrod", "Yellow Green", "Dark Blue", "Blanched Almond", "Forest Green", "Dark Red", "Light Steel Blue", "Medium Orchid", "Olive Drab", "Saddle Brown", "Alice Blue", "Mint Cream", "Azure", "Antique White", "Seashell", "Navy", "Light Grey", "Pale Green", "Magenta", "Tomato"]
  for (let i = 0; i < 5; i++) {
    const idx = Math.floor(Math.random() * names.length)
    let newUser: LeaderboardUser = {
			_id: idx.toString(),
			firstName: names[idx].split(' ')[0],
			lastName: names[idx].split(' ')[1] ?? "",
			username: (names[idx].split(' ')[0] + idx).toLowerCase(),
			distance: Math.floor(Math.random() * (30000 - 10000) + 10000),
			time: Math.floor(Math.random() * (10800 - 3600) + 3600),
			profile: "",
		};
    data.push(newUser)
  }
}

function toEmbedField(user: LeaderboardUser, index: number) {
	const fullName = (user.firstName + ' ' + user.lastName).trim();
	const username = user.username ? `(${user.username})` : '';
	const distance = user.distance / 1000;

	return {
		name: `${ordinal(index + 1)}`,
		value: `${distance.toFixed(1)}km | ${fullName} ${username}`,
		inline: false
	}
}

function ordinal(n: number) {
	if (n <= 3) {
			const medals = ['\u200b\n🥇','🥈','🥉']
			return medals[n - 1]
	}
	var s = ["th", "st", "nd", "rd"];
	var v = n % 100;
	return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// function getMessageRow(fields, pageNumber) {
//   const numPages = Math.ceil(Math.min(fields.length, numRanks) / pageSize);
//   const row = new MessageActionRow()
//   row.addComponents(
//     new MessageButton()
//     .setCustomId('prev-page')
//     .setLabel('Prev Page')
//     .setStyle('DANGER')
//     .setDisabled(pageNumber === 1),
//     new MessageButton()
//     .setCustomId('next-page')
//     .setLabel('Next Page')
//     .setStyle('SUCCESS')
//     .setDisabled(pageNumber === numPages),
//   )
//   return row;
// }

// async function togglePage(interaction) {
//   const guild = await Guild.findOne({ guildId : interaction.guild.id})
//   const fields = await getFields(guild)

//   const prevMessageEmbed = interaction.message.embeds[0];
//   let pageNumber = parseInt(prevMessageEmbed.footer.text.split(" ")
//     [prevMessageEmbed.footer.text.split(" ").length - 1])
//   if (interaction.customId == "prev-page") {
//       pageNumber -= 1;
//   } else if (interaction.customId == "next-page") {
//       pageNumber += 1
//   }

//   await interaction.update({
//     embeds: [getMessageEmbed(prevMessageEmbed.title, prevMessageEmbed.description, fields, pageNumber)],
//     components: [getMessageRow(fields, pageNumber)]
//   })
// }