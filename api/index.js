const admin = require("firebase-admin");
const express = require("express");
const app = express();

// Replace the path with the path to your Firebase service account private key file
const serviceAccount = require("../creds.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.use(express.json());

app.post("/makeuser", async (req, res) => {
  const { userId, apiKey } = req.body;
  try {
    //    make a new document in the users collection with the userId as the document id
    await db.collection("users").doc(userId).set({ apiKey });
    res.status(200).send({ status: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", error });
  }
});

app.post("/getkey", async (req, res) => {
  const { userId } = req.body;
  console.log("userId");
  console.log(req.query.userId);
  console.log(userId);
  try {
    const user = await db.collection("users").doc(userId).get();
    res.status(200).send({ status: "success", apiKey: user.data().apiKey });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", error });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
