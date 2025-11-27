const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// POST /api/gemini/prompt/send
app.post("/api/gemini/prompt/send", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ message: "Please send a valid prompt" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  const url =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
  apiKey;

  try {
    const response = await axios.post(
      url,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    return res.status(200).json({ response: response.data });
  } catch (err) {
    return res.status(500).json({
      message: "Error calling Gemini API",
      error: err?.response?.data || err.message
    });
  }
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

module.exports = { app };
