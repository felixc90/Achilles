import { Client } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import { User, Guild } from "../db";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("ready", () => {
  console.log("Discord bot is ready! 🤖");
});

client.on("guildCreate", async (guild) => {
	const newGuild = new Guild({ _id : guild.id, name : guild.name });
	await newGuild.save();
  await deployCommands({ guildId: guild.id });
});

client.on("guildDelete", async (guild) => {
  // await Guild.deleteOne({ _id: guild.id });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.DISCORD_TOKEN);


