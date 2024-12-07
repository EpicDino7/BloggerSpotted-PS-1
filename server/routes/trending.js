import express from "express";
import axios from "axios";
import TrendingTopic from "../models/TrendingTopic.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.get("/trending-topics", async (req, res) => {
  try {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const intervalHours = 2;
    const interval = Math.floor(currentHour / intervalHours);
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    console.log(`Fetching topics for interval ${interval} on ${currentDate}`);

    if (!process.env.NEWSDATA_API_KEY) {
      throw new Error("NewsData API key is missing");
    }

    let trendingTopics = await TrendingTopic.findOne({
      year: currentYear,
      month: currentMonth,
      day: currentDay,
      interval: interval,
    }).sort({ createdAt: -1 });

    if (!trendingTopics) {
      console.log(
        "No topics found for current interval, fetching from NewsData API..."
      );

      const firstResponse = await axios.get("https://newsdata.io/api/1/news", {
        params: {
          apikey: process.env.NEWSDATA_API_KEY,
          country: "us,in,gb",
          language: "en",
          size: 9,
        },
      });

      let allArticles = [];

      if (firstResponse.data && firstResponse.data.results) {
        allArticles = [...firstResponse.data.results];
      }

      if (!allArticles.length) {
        throw new Error("No articles received from NewsData API");
      }

      const uniqueArticles = allArticles
        .filter((article) => article.title && article.title.trim().length > 0)
        .reduce((acc, current) => {
          const formattedTitle = formatTopicTitle(current.title);
          const titleExists = acc.find(
            (item) => formatTopicTitle(item.title) === formattedTitle
          );
          if (!titleExists && formattedTitle.length > 0) {
            acc.push(current);
          }
          return acc;
        }, []);

      console.log(
        `Found ${uniqueArticles.length} unique articles after filtering`
      );

      const topics = uniqueArticles
        .slice(0, 9)
        .map((article, index) => ({
          name: formatTopicTitle(article.title),
          fullTitle: article.title,
          description: article.description || "",
          content: article.content || "",
          link: article.link || "",
          trendingScore: 100 - index * 10,
        }))
        .filter((topic) => topic.name.length > 0);

      if (topics.length === 9) {
        trendingTopics = new TrendingTopic({
          topics,
          year: currentYear,
          month: currentMonth,
          day: currentDay,
          interval: interval,
          createdAt: new Date(),
        });

        await trendingTopics.save();
        console.log(
          `Created new entry with ${topics.length} topics for interval ${interval}`
        );
        return res.json(topics);
      } else {
        throw new Error(`Unable to get 9 unique topics (got ${topics.length})`);
      }
    }

    res.json(trendingTopics.topics);
  } catch (error) {
    console.error("NewsData API Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    res.status(500).json({ error: error.message });
  }
});

function formatTopicTitle(title) {
  if (!title) return "";

  let fullSentence = title
    .replace(/[\[\](){}]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  let sentences = fullSentence.split(/(?<=[.!?])\s+/);
  let mainSentence = sentences[0];

  if (sentences.length > 1 && mainSentence.split(" ").length < 10) {
    mainSentence = sentences.slice(0, 2).join(" ");
  }

  let words = mainSentence.split(" ").filter((word) => word.length > 0);

  words = words.slice(0, Math.max(15, Math.min(10, words.length)));

  let finalTitle = words.join(" ");

  finalTitle = finalTitle.charAt(0).toUpperCase() + finalTitle.slice(1);

  return finalTitle;
}

function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export default router;
