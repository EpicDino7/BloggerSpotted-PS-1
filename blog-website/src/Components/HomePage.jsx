import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import "../StyleSheets/HomePage.css";

const DEFAULT_TOPICS = [
  { name: "Technology", trendingScore: 95 },
  { name: "Science", trendingScore: 90 },
  { name: "Art", trendingScore: 85 },
  { name: "Music", trendingScore: 80 },
  { name: "Travel", trendingScore: 75 },
  { name: "Food", trendingScore: 70 },
  { name: "Lifestyle", trendingScore: 65 },
  { name: "Health", trendingScore: 60 },
  { name: "Education", trendingScore: 55 },
];

const HomePage = () => {
  const [topics, setTopics] = useState(DEFAULT_TOPICS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrendingTopics();
  }, []);

  const fetchTrendingTopics = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/trending/trending-topics",
        { withCredentials: true }
      );
      console.log("Trending Topics Response:", response.data); // Debug log
      if (response.data && Array.isArray(response.data)) {
        const processedTopics = response.data.map((topic) => ({
          ...topic,
          name: formatTopicName(topic.name),
        }));
        setTopics(processedTopics);
        setError(null);
      } else {
        console.warn("Invalid data format received:", response.data);
        setError(
          "Unable to load trending topics. Showing default topics instead."
        );
      }
    } catch (error) {
      console.error("Error fetching trending topics:", error);
      setError(
        "Failed to fetch trending topics. Showing default topics instead."
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to format news headlines into more suitable topic names
  const formatTopicName = (headline) => {
    // Remove any text after certain punctuation marks
    let topic = headline.split(/[:.,-]/)[0];

    // Remove common news-specific phrases
    topic = topic.replace(/breaking|exclusive|report|update|news/gi, "");

    // Limit to first 5 words for readability
    topic = topic.split(" ").slice(0, 5).join(" ");

    // Trim whitespace and ensure first letter is capitalized
    topic = topic.trim();
    return topic.charAt(0).toUpperCase() + topic.slice(1);
  };

  if (loading) {
    return (
      <div className="page-container">
        <Navbar showLoginButton={false} />
        <div className="homepage-content">
          <div className="loading">Loading trending topics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Navbar showLoginButton={false} />
      <div className="homepage-content">
        <h1 className="trending-title">Trending Topics This Week</h1>
        {error && <div className="error-message">{error}</div>}
        <div className="topic-grid">
          {topics.map((topic, index) => (
            <Link
              to={`/topic/${encodeURIComponent(topic.name)}`}
              key={index}
              className="topic-box"
              style={{
                background: `linear-gradient(135deg, var(--accent-${
                  (index % 3) + 1
                }), var(--secondary-bg))`,
              }}
            >
              <div className="topic-content">
                <span className="topic-name">{topic.name}</span>
                <span className="trending-score">
                  Trending Score: {topic.trendingScore}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
