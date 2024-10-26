import express from "express";
import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const hf = new HfInference(process.env.HF_API_KEY);

router.post("/summarize", async (req, res) => {
  const { text } = req.body;
  try {
    const result = await hf.summarization({
      model: "facebook/bart-large-cnn",
      inputs: text,
      parameters: {
        max_length: 130,
        min_length: 30,
      },
    });
    res.status(200).json({ summary: result.summary_text });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
