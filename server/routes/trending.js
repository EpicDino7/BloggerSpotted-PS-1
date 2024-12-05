import express from "express";
import axios from "axios";
import TrendingTopic from "../models/TrendingTopic.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Get current trending topics
router.get("/trending-topics", async (req, res) => {
  try {
    const currentDate = new Date();
    const currentWeek = getWeekNumber(currentDate);
    const currentYear = currentDate.getFullYear();

    console.log(`Fetching topics for week ${currentWeek}, year ${currentYear}`); // Debug log

    let trendingTopics = await TrendingTopic.findOne({
      weekNumber: currentWeek,
      year: currentYear,
    });

    if (!trendingTopics) {
      console.log("No existing topics found, fetching from News API..."); // Debug log
      try {
        trendingTopics = await fetchTrendingTopicsFromNewsAPI(
          currentWeek,
          currentYear
        );
        console.log("New topics fetched successfully"); // Debug log
      } catch (fetchError) {
        console.error("Error fetching topics from News API:", fetchError);
        // Use fallback topics
        trendingTopics = await new TrendingTopic({
          topics: [
            { name: "Artificial Intelligence", trendingScore: 95 },
            { name: "Climate Change", trendingScore: 90 },
            { name: "Digital Privacy", trendingScore: 85 },
            { name: "Mental Health", trendingScore: 80 },
            { name: "Space Exploration", trendingScore: 75 },
            { name: "Sustainable Living", trendingScore: 70 },
            { name: "Remote Work", trendingScore: 65 },
            { name: "Blockchain", trendingScore: 60 },
            { name: "Renewable Energy", trendingScore: 55 },
          ],
          weekNumber: currentWeek,
          year: currentYear,
        }).save();
      }
    } else {
      console.log("Found existing topics for current week"); // Debug log
    }

    res.json(trendingTopics.topics);
  } catch (error) {
    console.error("Server error in trending-topics:", error);
    res.status(500).json({
      message: "Error fetching trending topics",
      error: error.message,
    });
  }
});

async function fetchTrendingTopicsFromNewsAPI(weekNumber, year) {
  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        apiKey: process.env.NEWS_API_KEY,
        country: "us", // You can change this to your preferred country
        category: "general", // You can change this to your preferred category
        pageSize: 9, // Limit to 9 topics
      },
    });

    console.log("News API Response:", response.data); // Debug log

    const articles = response.data.articles;
    const topics = articles.map((article, index) => ({
      name: article.title,
      trendingScore: 100 - index * 10, // Assign a trending score based on position
    }));

    const newTrendingTopics = new TrendingTopic({
      topics,
      weekNumber,
      year,
    });

    await newTrendingTopics.save();
    return newTrendingTopics;
  } catch (error) {
    console.error("Error fetching from News API:", error);
    throw error;
  }
}

function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export default router;
