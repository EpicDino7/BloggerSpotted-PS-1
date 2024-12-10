import React from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";

const topics = [
  "Technology",
  "Design",
  "Music",
  "Art",
  "Science",
  "Travel",
  "Lifestyle",
];

const Homepage = () => {
  return (
    <div className="homepage">
      <h1>Welcome to My Blog</h1>
      <div className="topics-grid">
        {topics.map((topic, index) => (
          <Link
            to={`/topic/${topic.toLowerCase()}`}
            key={index}
            className="topic-box"
          >
            {topic}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
