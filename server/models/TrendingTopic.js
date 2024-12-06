import mongoose from "mongoose";

const trendingTopicSchema = new mongoose.Schema({
  topics: [
    {
      name: String,
      fullTitle: String,
      description: String,
      content: String,
      link: String,
      trendingScore: Number,
    },
  ],
  year: Number,
  month: Number,
  day: Number,
  interval: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

trendingTopicSchema.index({
  year: 1,
  month: 1,
  day: 1,
  interval: 1,
  createdAt: -1,
});

trendingTopicSchema.statics.cleanOldEntries = async function () {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  await this.deleteMany({
    createdAt: { $lt: thirtyDaysAgo },
  });
};

export default mongoose.model("TrendingTopic", trendingTopicSchema);
