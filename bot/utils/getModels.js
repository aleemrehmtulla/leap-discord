import crypto from "crypto";
import env from "dotenv";
import fetch from "node-fetch";
env.config({ path: "../../.env" });

const getModels = async (API_KEY) => {
  if (!API_KEY) throw new Error("No API key provided!");

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

  return choices.reverse();
};
export default getModels;
