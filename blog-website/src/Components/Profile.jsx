import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import axios from "axios";
import Navbar from "./Navbar";
import "../StyleSheets/Profile.css";

const API_URL = "http://localhost:5000/api";

export const Profile = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserBlogs();
    }
  }, [user]);

  const fetchUserBlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs/user/${user._id}`);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching user blogs:", error);
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

  if (!user) {
    return <div>Log in bro</div>;
  }

  return (
    <div className="page-container">
      <Navbar showLoginButton={true} />
      <div className="profile-content">
        <div className="profile-header">
          <h1>My Profile</h1>
          <div className="user-info">
            <p>Welcome, {user.displayName}</p>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="my-blogs-section">
          <h2>Blog Posts</h2>
          <div className="blogs-grid">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <div key={blog._id} className="blog-card">
                  <h3>{blog.title}</h3>
                  <p className="blog-topic">Topic: {blog.topic}</p>
                  <p className="blog-preview">
                    {blog.content.substring(0, 150)}...
                  </p>
                  <p className="blog-date">
                    Posted on: {formatDate(blog.createdAt)}
                  </p>
                  <a href={`/blog/${blog._id}`} className="read-more-link">
                    Read More
                  </a>
                </div>
              ))
            ) : (
              <p className="no-blogs-message">
                You haven't posted any blogs yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
