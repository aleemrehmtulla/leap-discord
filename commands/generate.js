import fetch from "node-fetch";

import {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";

import env from "dotenv";
env.config();

const API_KEY = process.env.API_KEY;

export const generateData = new SlashCommandBuilder()
  .setName("generate")
  .setDescription("Generate an image with Stable Diffusion")
  .addStringOption((option) =>
    option
      .setName("prompt")
      .setDescription("Enter a prompt for the image")
      .setRequired(true)
  );

export const generateExecute = async (interaction, choices) => {
  const prompt = interaction.options.getString("prompt");

  // limit to discord max. if wanted you can add a second row 🙂
  const row = new ActionRowBuilder().addComponents(
    choices.slice(0, 4).map((choice) => {
      return new ButtonBuilder()
        .setLabel(choice.title)
        .setStyle(ButtonStyle.Primary)
        .setCustomId(choice.id);
    })
  );
  interaction.reply({ content: "Select a model to use", components: [row] });

  // listen for a response. if they dont respond in 15s, end the interaction
  const filter = (interaction) =>
    interaction.customId && interaction.user.id === interaction.user.id;
  const collector = interaction.channel.createMessageComponentCollector({
    filter,
    time: 15000,
  });

  // when they respond, get the prompt and generate the image
  collector.on("collect", async (interaction) => {
    // begin image generation
    const url = `https://api.leapml.dev/api/v1/images/models/${interaction.customId}/inferences`;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    };
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.statusCode === 402 || data.statusCode === 500) {
      interaction.reply(
        "Looks like there was an error! Our best bet is you hit a rate limit. Msg @thealexshaq or @aleemrehmtulla for help"
      );
      return;
    }

    const inferenceId = data.id;

    // Wait 15 seconds for the image to be generated
    // Hacky workaround to make bot setup quick, elimnating need for discord webhooks
    // TODO: make this wait for a webhook instead of a timer.
    interaction.reply("Your image will be ready in 15s");
    for (let i = 14; i > 0; i--) {
      await new Promise((resolve) => setTimeout(resolve, 1100));
      await interaction.editReply(`Your image will be ready in ${i}` + "s");
    }

    const imageUrlUrl = `https://api.leapml.dev/api/v1/images/models/${interaction.customId}/inferences/${inferenceId}`;
    const imageOptions = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: "Bearer " + API_KEY,
      },
    };

    // Make the API request to retrieve the generated image
    const imageResponse = await fetch(imageUrlUrl, imageOptions);
    const imageData = await imageResponse.json();
    console.log(imageData);

    const imageUrl = imageData.images[0].uri;
    console.log("Got image: " + imageUrl);

    // Reply with the generated image
    await interaction.editReply({
      content: "Here's your generated image:",
      files: [imageUrl],
    });
    collector.stop(); // Stop collecting after the first interaction
  });
  collector.on("end", async (collected) => {
    if (collected.size === 0) {
      await interaction.followUp({
        content: "No model selected, please try again.",
        ephemeral: true,
      });
    }
  });
};
