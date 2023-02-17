import fetch from "node-fetch";
import { SlashCommandBuilder } from "discord.js";
import env from "dotenv";
env.config();

const API_KEY = process.env.API_KEY;

export const trainData = new SlashCommandBuilder()
  .setName("train")
  .setDescription("Train a custom model")
  .addStringOption((option) =>
    option
      .setName("title")
      .setDescription("Title of the model")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("keyword")
      .setDescription("The subject of the model (e.g. '@aleem')")
      .setRequired(true)
  )
  // TODO: is there a way to map this? lots of repetition
  .addAttachmentOption((option) =>
    option.setName("image-1").setDescription("Image 1").setRequired(true)
  )
  .addAttachmentOption((option) =>
    option.setName("image-2").setDescription("Image 2").setRequired(false)
  )
  .addAttachmentOption((option) =>
    option.setName("image-3").setDescription("Image 3").setRequired(false)
  )
  .addAttachmentOption((option) =>
    option.setName("image-4").setDescription("Image 4").setRequired(false)
  )
  .addAttachmentOption((option) =>
    option.setName("image-5").setDescription("Image 5").setRequired(false)
  )
  .addAttachmentOption((option) =>
    option.setName("image-6").setDescription("Image 6").setRequired(false)
  )
  .addAttachmentOption((option) =>
    option.setName("image-7").setDescription("Image 7").setRequired(false)
  );

export const trainExecute = async (interaction) => {
  const title = interaction.options.getString("title");
  const subject = interaction.options.getString("keyword");

  interaction.reply("Beginning model creation...");

  //  TODO: Same as above, this feels wrong lol
  const image1 = interaction.options.getAttachment("image-1");
  const image2 = interaction.options.getAttachment("image-2");
  const image3 = interaction.options.getAttachment("image-3");
  const image4 = interaction.options.getAttachment("image-4");
  const image5 = interaction.options.getAttachment("image-5");
  const image6 = interaction.options.getAttachment("image-6");
  const image7 = interaction.options.getAttachment("image-7");

  // make an array of only the images that arent null. also feels wrong
  const images = [
    image1?.url,
    image2?.url,
    image3?.url,
    image4?.url,
    image5?.url,
    image6?.url,
    image7?.url,
  ];
  //   remove all the undefined values
  const filteredImages = images.filter((image) => image !== undefined);
  console.log(filteredImages);

  // Create the model
  const createModelUrl = "https://api.leapml.dev/api/v1/images/models";
  const createModelOptions = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: "Bearer " + API_KEY,
    },
    body: JSON.stringify({ title: title, subjectKeyword: subject }),
  };
  const createdModel = await fetch(createModelUrl, createModelOptions);
  const data = await createdModel.json();

  interaction.editReply("Model created: " + data.id);

  // Add images to the model
  const addImagesUrl = `https://api.leapml.dev/api/v1/images/models/${data.id}/samples/url`;
  const addImagesOptions = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: "Bearer " + API_KEY,
    },
    body: JSON.stringify({
      images: filteredImages,
    }),
  };
  const addedImages = await fetch(addImagesUrl, addImagesOptions);
  const responseImages = await addedImages.json();

  interaction.editReply("Images added: " + responseImages[0].id);

  //   wait for 5 seconds before starting training
  await new Promise((r) => setTimeout(r, 5000));
  interaction.editReply("Starting training...");
  await new Promise((r) => setTimeout(r, 1600));

  // Start training the model
  const startTrainingUrl = `https://api.leapml.dev/api/v1/images/models/${data.id}/queue`;
  const startTrainingOptions = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: "Bearer " + API_KEY,
    },
  };
  const trainingStarted = await fetch(startTrainingUrl, startTrainingOptions);
  const responseTraining = await trainingStarted.json();

  // training the model takes 10-15 minutes, so we can't wait for it to finish
  // send a message telling them to check back later
  await interaction.editReply(
    `Model training started. You'll be able to use it with /generate in 15-20 minutes!`
  );
};
