import fetch from "node-fetch";
import env from "dotenv";
env.config();

import { Client, GatewayIntentBits } from "discord.js";
import { generateData, generateExecute } from "./commands/generate.js";
import { trainData, trainExecute } from "./commands/train.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const TOKEN = process.env.DISCORD_KEY;
const API_KEY = process.env.API_KEY;

// set the commands on startup
client.on("ready", async () => {
  console.log(`✅ Started Server ✅`);
  console.log(`Logged in as ${client.user.tag}!`);
  client.application.commands.set([generateData, trainData]);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // run /commands/train.js and /commands/generate.js
  if (interaction.commandName === "train") {
    await trainExecute(interaction);
  }

  if (interaction.commandName === "generate") {
    // get the options for our button row (the models)
    const url = "https://api.leapml.dev/api/v1/images/models";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: "Bearer " + API_KEY,
      },
    };
    const res = await fetch(url, options);
    const json = await res.json();

    const choices = json.map((model) => {
      return {
        title: model.title,
        id: model.id,
      };
    });

    // add in two default models
    choices.push({
      title: "Stable Diffusion 1.5",
      id: "8b1b897c-d66d-45a6-b8d7-8e32421d02cf",
    });
    choices.push({
      title: "Future Diffusion",
      id: "1285ded4-b11b-4993-a491-d87cdfe6310c",
    });

    await generateExecute(interaction, choices.reverse());
  }
});

client.login(TOKEN);
