import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import axios from "axios";
import Navbar from "./Navbar";
import "../StyleSheets/Profile.css";
import NewBlogPost from "./NewBlogPost";
import EditBlogPost from "./EditBlogPost";

const API_URL = "http://localhost:5000/api";

export const Profile = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [showEditPostForm, setShowEditPostForm] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);

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

  const editBlog = (blog) => {
    setShowEditPostForm(true);
    setCurrentBlog(blog);
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

  const handleUpdateBlog = (updatedBlog) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog._id === updatedBlog._id ? updatedBlog : blog
      )
    );
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
            {showEditPostForm && currentBlog && (
              <EditBlogPost
                blog={currentBlog}
                onCancel={() => {
                  setShowEditPostForm(false);
                  setCurrentBlog(null);
                }}
                onUpdate={handleUpdateBlog}
              />
            )}
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
                  <button onClick={() => deleteBlog(blog._id)}>Delete</button>
                  <button
                    className="update"
                    onClick={() => {
                      editBlog(blog);
                    }}
                  >
                    Edit
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
      {showNewPostForm && (
        <NewBlogPost
          onCancel={() => {
            setShowNewPostForm(false);
          }}
        />
      )}
    </div>
  );
};

export default Profile;
