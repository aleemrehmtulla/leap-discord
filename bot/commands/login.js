import fetch from "node-fetch";
import { SlashCommandBuilder } from "discord.js";
import crypto from "crypto";
import env from "dotenv";
env.config({ path: "../.env" });

const secretKey = process.env.ENCRYPTION_KEY;

export const loginData = new SlashCommandBuilder()
  .setName("login")
  .setDescription("Login to your LeapML account")
  .addStringOption((option) =>
    option.setName("apikey").setDescription("Your API Key").setRequired(true)
  );

export const loginExecute = async (interaction) => {
  const userId = interaction.user.id;
  const apiKey = interaction.options.getString("apikey");

  // encode api key
  const initialVector = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, initialVector);
  let encodedApiKey = cipher.update(apiKey, "utf8", "hex");
  encodedApiKey += cipher.final("hex");
  const encodedKey = initialVector.toString("hex") + encodedApiKey;

  // make the request to the api
  const response = await fetch(`${SERVER_URL}makeuser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      username: interaction.user.username,
      apiKey: encodedKey,
    }),
  });

  await interaction.reply(
    "We've linked your accoun to the API key provided! Try using the /generate command now!"
  );
};
