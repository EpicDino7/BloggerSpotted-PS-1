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

  const deleteBlog = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/blogs/${id}`);
      setBlogs(response.data);
      fetchUserBlogs();
    } catch (error) {
      console.error("Error deleting blog: ", error);
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
                  <button
                    className="delete-btn"
                    onClick={() => {
                      deleteBlog(blog._id);
                    }}
                  >
                    <svg
                      className="delete-svg"
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.12817 8.15391C5.12817 10.4103 5.12817 13.5898 5.12817 15.1283C5.23074 16.4616 5.3333 18.2052 5.43587 19.436C5.53843 20.8719 6.7692 22.0001 8.2051 22.0001H15.7948C17.2307 22.0001 18.4615 20.8719 18.5641 19.436C18.6666 18.2052 18.7692 16.4616 18.8718 15.1283C18.9743 13.5898 18.8718 10.4103 18.8718 8.15391H5.12817Z"
                        fill="#030D45"
                      />
                      <path
                        d="M19.1795 5.07698H16.6154L15.7949 3.53852C15.2821 2.61545 14.359 2.00006 13.3333 2.00006H10.8718C9.84615 2.00006 8.82051 2.61545 8.41026 3.53852L7.38462 5.07698H4.82051C4.41026 5.07698 4 5.48724 4 5.8975C4 6.30775 4.41026 6.71801 4.82051 6.71801H19.1795C19.5897 6.71801 20 6.41032 20 5.8975C20 5.38468 19.5897 5.07698 19.1795 5.07698ZM9.12821 5.07698L9.64103 4.25647C9.84615 3.84621 10.2564 3.53852 10.7692 3.53852H13.2308C13.7436 3.53852 14.1538 3.74365 14.359 4.25647L14.8718 5.07698H9.12821Z"
                        fill="#030D45"
                      />
                    </svg>
                  </button>
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
