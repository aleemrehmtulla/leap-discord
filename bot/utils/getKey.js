import crypto from "crypto";
import env from "dotenv";
import fetch from "node-fetch";
env.config({ path: "../.env" });

const SERVER_URL = process.env.SERVER_URL;

const getKey = async (userId) => {
  if (!userId) throw new Error("No user ID provided!");

  // Get the encrypted API key from the database
  const getUser = await fetch(`${SERVER_URL}getkey`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
    }),
  });
  const res = await getUser.json();

  // Decrypt the API key
  const secretKey = process.env.ENCRYPTION_KEY;
  const initialVector = Buffer.from(res.apiKey.slice(0, 32), "hex");
  const encodedApiKey = res.apiKey.slice(32);
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    secretKey,
    initialVector
  );
  let apiKey = decipher.update(encodedApiKey, "hex", "utf8");
  apiKey += decipher.final("utf8");

  // Send it back to the user
  console.log(apiKey);
  return apiKey;
};
export default getKey;
