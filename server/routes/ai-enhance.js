import express from "express";
import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const hf = new HfInference(process.env.HF_API_KEY);

router.post("/enhance", async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  try {
    const prompt = `
    As an expert editor, enhance the following blog post while maintaining its original message, style, and personal voice. 
    Make it more engaging and professional, improve clarity and flow, but keep the core content intact.
    Do not change the content of the blog post, only enhance it. The blog post should have the same opinion and message as the original. Do not add any new information. Do not remove any information. Do not change the tone of the blog post. You can change the lenght of the blog post but do not change it by a large number and do make it more engaging and professional. Do not add your own references or links. 

    Original Blog:
    ${content}

    Enhanced version:`;

    const result = await hf.textGeneration({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      inputs: prompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        repetition_penalty: 1.2,
        return_full_text: false,
      },
    });

    console.log(result);

    const enhancedContent = result.generated_text.replace(prompt, "").trim();

    if (!enhancedContent) {
      throw new Error("Empty response from AI model");
    }

    res.json({ enhancedContent });
  } catch (error) {
    console.error("AI Enhancement error:", error);
    res.status(500).json({
      message: "Error enhancing content",
      error: error.message,
    });
  }
});

export default router;
