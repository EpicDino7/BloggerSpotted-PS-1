import express from "express";
import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

const router = express.Router();
const hf = new HfInference(process.env.HF_API_KEY);

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

router.post("/imageai", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "File size exceeds 5MB limit",
      });
    }

    const caption = await hf.imageToText({
      model: "Salesforce/blip-image-captioning-large",
      data: req.file.buffer,
    });

    console.log(caption);

    if (!caption || !caption.generated_text) {
      throw new Error("Failed to generate image caption");
    }

    const prompt = `Write an engaging blog post (200-300 words) about this image: ${caption.generated_text}. 
    Include a clear introduction, body, and conclusion but do not include the headings explicitly. Do not include the title in the generated output. Write a concise and fun blog about the caption and make it more story-like in the sense of the writing style and essence. Make it more presentable towards a wider range of audience.`;

    const blogResult = await hf.textGeneration({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
        return_full_text: false,
      },
    });

    if (!blogResult || !blogResult.generated_text) {
      throw new Error("Failed to generate blog content");
    }

    res.json({
      success: true,
      blogPost: blogResult.generated_text.trim(),
      imageCaption: caption.generated_text,
    });
  } catch (error) {
    console.error("Error in image processing:", error);
    res.status(500).json({
      success: false,
      message: "Error processing image",
      error: error.message,
    });
  }
});

export default router;
