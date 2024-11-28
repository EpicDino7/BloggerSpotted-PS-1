import express from 'express';
import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";
import multer from 'multer';
import Blog from "../models/Blog.js"; 


dotenv.config();


const router = express.Router();
const hf = new HfInference(process.env.HF_API_KEY);
const upload = multer({ dest: '/uploads/' });
router.post('/imageai', upload.single('image'), async (req, res) => {
  const { topic } = req.body; 
 const imagePath = req.file.path; 
  try {
   // Call AI service to generate blog content based on the image
   const result = await hf.imageGeneration({
     model: "your-image-to-text-model", // Replace with your model
     inputs: req.file.buffer,
   });
    const newBlog = new Blog({
     title: result.title, // Assuming the AI returns a title
     content: result.content, // Assuming the AI returns content
     topic: topic,
     author: req.user._id,
     image: imagePath, // Save the image path
   });
    await newBlog.save();
   res.status(201).json(newBlog);
 } catch (error) {
   res.status(500).json({ message: error.message });
 }
);
export default router;