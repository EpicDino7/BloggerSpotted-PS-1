import React, { useState } from "react";
import "./BlogTopic.css";

const BlogTopic = ({ match }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const topic = match.params.topic;

  const handleLogin = () => {
    // Implement login logic here
    setIsLoggedIn(true);
  };

  return (
    <div className="blog-topic">
      <h2>{topic.charAt(0).toUpperCase() + topic.slice(1)} Blogs</h2>
      {!isLoggedIn && (
        <button onClick={handleLogin} className="login-button">
          Login to Post
        </button>
      )}
      <div className="blogs-container">
        {/* Render blogs here */}
        <div className="blog-post">Blog Post 1</div>
        <div className="blog-post">Blog Post 2</div>
        {/* Add more blog posts */}
      </div>
    </div>
  );
};

export default BlogTopic;
