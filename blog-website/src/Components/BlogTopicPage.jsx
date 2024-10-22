import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import NewBlogPost from "./NewBlogPost";
import { useAuth } from "../AuthContext";
import "../StyleSheets/BlogTopicPage.css";

const API_URL = "http://localhost:5000/api";

const sampleBlogs = {
  Technology: [
    {
      id: 1,
      title: "The Future of AI",
      content:
        "Artificial Intelligence is rapidly evolving, with new breakthroughs happening every day...",
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "5G Revolution",
      content:
        "5G networks are set to transform how we connect, offering unprecedented speeds and low latency...",
      createdAt: new Date(),
    },
    {
      id: 3,
      title: "Cybersecurity in 2023",
      content:
        "As our world becomes increasingly digital, the importance of robust cybersecurity measures cannot be overstated...",
      createdAt: new Date(),
    },
  ],
  Science: [
    {
      id: 1,
      title: "Mars Exploration Update",
      content:
        "Recent missions to Mars have provided exciting new data about the red planet's geology and potential for sustaining life...",
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "Breakthrough in Quantum Computing",
      content:
        "Scientists have achieved a major milestone in quantum computing, paving the way for unprecedented computational power...",
      createdAt: new Date(),
    },
    {
      id: 3,
      title: "The Hunt for Dark Matter",
      content:
        "Researchers are employing new techniques in the ongoing search for dark matter, the mysterious substance that makes up a large portion of our universe...",
      createdAt: new Date(),
    },
  ],
  Art: [
    {
      id: 1,
      title: "Digital Art Revolution",
      content:
        "NFTs have taken the art world by storm, offering new opportunities and challenges for artists in the digital age...",
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "Renaissance Masters Exhibition",
      content:
        "A new exhibition bringing together works from Leonardo, Michelangelo, and Raphael is set to open next month...",
      createdAt: new Date(),
    },
    {
      id: 3,
      title: "Street Art's Rising Influence",
      content:
        "Once considered vandalism, street art is now recognized as a powerful form of cultural expression and social commentary...",
      createdAt: new Date(),
    },
  ],
};

const BlogTopicPage = () => {
  const { topic } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setBlogs(sampleBlogs[topic] || []);
  }, [topic]);

  const addNewBlog = (newBlog) => {
    const updatedBlogs = [
      ...blogs,
      { ...newBlog, id: blogs.length + 1, createdAt: new Date() },
    ];
    setBlogs(updatedBlogs);
    setShowNewPostForm(false);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="page-container">
      <Navbar showLoginButton={true} />
      <div className="blog-topic-content">
        <div className="topic-header">
          <h1 className="topic-title">
            {topic.charAt(0).toUpperCase() + topic.slice(1)}
          </h1>
        </div>

        {user && (
          <div className="add-post-section">
            <button
              className="add-post-btn"
              onClick={() => setShowNewPostForm(true)}
            >
              Add New Post
            </button>
          </div>
        )}

        {showNewPostForm && (
          <NewBlogPost
            onSubmit={addNewBlog}
            onCancel={() => setShowNewPostForm(false)}
          />
        )}

        <div className="blogs-container">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog.id} className="blog-box">
                <h2>{blog.title}</h2>
                <p>{blog.content.substring(0, 100)}...</p>
                <p className="blog-date">
                  Posted on: {formatDate(blog.createdAt)}
                </p>
                <a href={`/blog/${blog.id}`} className="read-more">
                  Read More
                </a>
              </div>
            ))
          ) : (
            <p>No blogs found for this topic.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogTopicPage;
