import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import "../StyleSheets/HomePage.css";

const HomePage = () => {
  const [topics, setTopics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    fetchTrendingTopics();
  }, []);

  const fetchTrendingTopics = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/trending/trending-topics",
        { withCredentials: true }
      );
      console.log("Trending Topics Response:", response.data);
      if (response.data && Array.isArray(response.data)) {
        const processedTopics = response.data.map((topic) => ({
          ...topic,
          name: topic.name,
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
      <Navbar showLoginButton={true} />
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
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
