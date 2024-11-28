import express from "express";
import Blog from "../models/Blog.js";

const router = express.Router();

router.get("/topic/:topic", async (req, res) => {
  try {
    const blogs = await Blog.find({ topic: req.params.topic })
      .populate("author", "displayName")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const blog = new Blog({
    ...req.body,
    author: req.user._id,
  });

  try {
    const newBlog = await blog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "displayName"
    );
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.userId })
      .populate("author", "displayName")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id: blogID } = req.params;
    const blog = await Blog.findByIdAndUpdate(blogID, req.body, { new: true });
    res.status(200).json({ blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id: blogID } = req.params;
    const blog = await Blog.findOneAndDelete({ _id: blogID });
    res.status(200).json({ blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
