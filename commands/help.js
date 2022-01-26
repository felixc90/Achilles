const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Updates the weekly stats'),
        async execute(interaction) {
        const helpEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Achilles Bot Help`)
            .addFields(
                {'name' : '💯 Register User - `/register`', 'value': 'Adds the user\'s statistics to the server.', 'inline': false},
                {'name' : '🎉  Display Leaderboard - `/leaderboard`',
                'value': 'Displays the weekly strava leaderboard based on time or distance.', 'inline': false},
                {'name' : '⚡️ Update Leaderboard - `/update`', 'value': 'Force updates the weekly statistics.', 'inline': false},
                {'name' : '👟 Mileage - `/mileage <time unit> <name>`', 'value': 'Displays a graph of given users\' recent activity.', 'inline': false},
                {'name' : '👟 Athlete Profile - `/profile`', 'value': 'Shows athlete profile and some quick statistics.', 'inline': false},
                {'name' : '🔥 Heatmap - `/heatmap`', 'value': 'Generates a thermal map of runners in the server.', 'inline': false}
            )
        await interaction.reply({embeds : [helpEmbed]})
        }
};