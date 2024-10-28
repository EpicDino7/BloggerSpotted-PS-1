import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/auth.js";
import blogRoutes from "./routes/blogs.js";
import aiRoutes from "./routes/summarize.js";
import aiEnhanceRoutes from "./routes/ai-enhance.js";
import "./config/passport.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ai", aiEnhanceRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
