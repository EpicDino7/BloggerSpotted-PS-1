import mongoose from "mongoose";

const trendingTopicSchema = new mongoose.Schema({
  topics: [
    {
      name: String,
      trendingScore: Number,
    },
  ],
  weekNumber: Number,
  year: Number,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("TrendingTopic", trendingTopicSchema);
