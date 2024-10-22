import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "../StyleSheets/HomePage.css";

const topics = [
  "Technology",
  "Science",
  "Art",
  "Music",
  "Travel",
  "Food",
  "Lifestyle",
  "Health",
  "Education",
];

const HomePage = () => {
  return (
    <div className="page-container">
      <Navbar showLoginButton={false} />
      <div className="homepage-content">
        <div className="topic-grid">
          {topics.map((topic, index) => (
            <Link to={`/topic/${topic}`} key={index} className="topic-box">
              {topic}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
