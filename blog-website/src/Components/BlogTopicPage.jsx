import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import NewBlogPost from "./NewBlogPost";
import { useAuth } from "../AuthContext";
import "../StyleSheets/BlogTopicPage.css";

const API_URL = "http://localhost:5000/api";

const BlogTopicPage = () => {
  const { topic } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const { user } = useAuth();
  const [summaries, setSummaries] = useState({});

  useEffect(() => {
    fetchBlogs();
  }, [topic]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs/topic/${topic}`);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const addNewBlog = async (blogData) => {
    try {
      await axios.post(
        `${API_URL}/blogs`,
        {
          ...blogData,
          topic: topic,
        },
        {
          withCredentials: true,
        }
      );
      fetchBlogs();
      setShowNewPostForm(false);
    } catch (error) {
      console.error("Error creating blog:", error);
    }
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

  const summarizeBlog = async (blogId, content) => {
    try {
      const response = await axios.post(`${API_URL}/ai/summarize`, {
        text: content,
      });
      setSummaries((prev) => ({
        ...prev,
        [blogId]: response.data.summary,
      }));
    } catch (error) {
      console.error("Error summarizing blog:", error);
    }
  };

  const clearSummary = (blogId) => {
    setSummaries((prev) => {
      const newSummaries = { ...prev };
      delete newSummaries[blogId];
      return newSummaries;
    });
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
              <div key={blog._id} className="blog-box">
                <h2>{blog.title}</h2>
                <p>{blog.content.substring(0, 100)}...</p>
                <p className="blog-date">
                  Posted on: {formatDate(blog.createdAt)}
                </p>
                {/* <p className="blog-author">By: {blog.author.displayName}</p> */}
                <a href={`/blog/${blog._id}`} className="read-more">
                  Read More
                </a>
                <button
                  onClick={() => summarizeBlog(blog._id, blog.content)}
                  className="summarize-btn"
                >
                  Summarize
                </button>
                {summaries[blog._id] && (
                  <div className="summary-container">
                    <p className="blog-summary">{summaries[blog._id]}</p>
                    <button
                      onClick={() => clearSummary(blog._id)}
                      className="clear-summary-btn"
                    >
                      Clear Summary
                    </button>
                  </div>
                )}
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
