const express = require("express");
const dotenv = require("dotenv");
const app = express();
const port = 3000;
dotenv.config();
app.use(express.json());
app.post("/api/gemini/prompt/send", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ message: "Please send a valid prompt" });
  }
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.API_KEY}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method:"POST",
        body:JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      })
      }
    );
      const data = await response.json();
      console.log("Gemini API response:", data);
      res.status(200).json({ response: data });
  } catch (err) {
    res.status(500)
  }
});
app.listen(port, () => {
  console.log(`app listening on port ${port}`)
});
module.exports = { app };
