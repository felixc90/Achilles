import { Client } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { buttons } from "./buttons";
import { deployCommands } from "./deploy-commands";
import { Guild, User } from "./models";
import express, { Request, Response } from 'express';
import mongoose from "mongoose";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("ready", () => {
  console.log("Discord bot is ready! 🤖");
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
	await Guild.updateOne(
		{ _id: guild.id },
		{ $set: { _id : guild.id, name : guild.name } },
		{ upsert: true }
	);
});

client.on("guildDelete", async (guild) => {
  // await Guild.deleteOne({ _id: guild.id });
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
		const { customId } = interaction;
		if (buttons[customId as keyof typeof buttons]) {
			buttons[customId as keyof typeof buttons].execute(interaction);
		}
  }

	if (interaction.isCommand()) {
		const { commandName } = interaction;
		if (commands[commandName as keyof typeof commands]) {
			commands[commandName as keyof typeof commands].execute(interaction);
		}
	}
});

client.login(config.DISCORD_TOKEN);

const app = express();

const port = process.env.PORT || 4000;

app.get('/callback/:guildId/:userId/:username', async (req: Request, res: Response) => {
	const code = req.query.code || null;

	const authOptions = {
		method: 'post',
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			client_id: config.STRAVA_CLIENT_ID,
			client_secret: config.STRAVA_CLIENT_SECRET,
			code: code,
			grant_type: 'authorization_code'
		}),
	};

	const result = await fetch('https://www.strava.com/oauth/token', authOptions);
	const json = await result.json();

	if (result.ok) {
		const user = new User({
			_id: req.params.userId,
			athleteId: json.athlete.id,
			firstName: json.athlete.firstname,
			lastName: json.athlete.lastname,
			username: req.params.username,
			profile: json.athlete.profile,
			accessToken: {
				accessToken: json.access_token,
				refreshToken: json.refresh_token,
				expiresAt: json.expires_at,
				tokenType: json.token_type,
				expiresIn: json.expires_in,
			}
		})
		await user.save();

		let guild = await Guild.findOne({ _id : req.params.guildId });
		if (guild != null && !guild.members.includes(req.params.userId)) {
			guild.members.push(req.params.userId);
			await guild.save();
		}
	}

	// TODO: remove below
	res.json({ message : 'User Registered!' })
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port} 🚀`);
});

mongoose.connect(config.MONGODB_CONNECT).then(() => {
	console.log('Database connected successfully 📚')
});