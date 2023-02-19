import fetch from "node-fetch";
import env from "dotenv";
env.config({ path: "../.env" });

import { Client, GatewayIntentBits } from "discord.js";
import { generateData, generateExecute } from "./commands/generate.js";
import { trainData, trainExecute } from "./commands/train.js";
import { loginData, loginExecute } from "./commands/login.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
console.log("✅ Started Server ✅");

// env is in the root directory of the project
const TOKEN = process.env.DISCORD_KEY;
const API_KEY = process.env.API_KEY;

// set the commands on startup
client.on("ready", async () => {
  console.log(`✅ Started Server ✅`);
  console.log(`Logged in as ${client.user.tag}!`);
  // delete all commands
  await client.application.commands.set([generateData, trainData, loginData]);
});

client.on("error", (error) => {
  console.log(error);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // run /commands/train.js and /commands/generate.js
  if (interaction.commandName === "train") {
    await trainExecute(interaction);
  }

  if (interaction.commandName === "login") {
    await loginExecute(interaction);
  }

  if (interaction.commandName === "generate") {
    await generateExecute(interaction);
  }
});

client.login(TOKEN);
