import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import "../StyleSheets/BlogPost.css";
import {
  RedditIcon,
  RedditShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
  TwitterShareButton,
  LinkedinIcon,
  LinkedinShareButton,
} from "react-share";

const API_URL = "http://localhost:5000/api";

const BlogPost = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs/${id}`);
      setBlog(response.data);
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  };

  const updateBlog = async () => {
    try {
      const response = await axios.put(`${API_URL}/blogs/${id}`);
    } catch (error) {
      console.log(error);
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

  if (!blog) {
    return <div>Loading...</div>;
  }

  const blogurl = window.location.href;
  const blogtitle = blog.title;
  const blogcontent = blog.content;
  return (
    <div className="page-container">
      <Navbar showLoginButton={true} />
      <div className="blog-post-content">
        <article className="blog-post">
          <h1 className="blog-title">{blog.title}</h1>
          <div className="blog-metadata">
            <span className="blog-date">
              Posted on: {formatDate(blog.createdAt)}
            </span>
            <RedditShareButton url={blogcontent} title={blogtitle}>
              <RedditIcon size={32} />
            </RedditShareButton>

            <WhatsappShareButton url={blogcontent} title={blogtitle}>
              <WhatsappIcon size={32} />
            </WhatsappShareButton>

            <TwitterShareButton url={blogcontent} title={blogtitle}>
              <XIcon size={32} />
            </TwitterShareButton>

            <LinkedinShareButton url={blogcontent} title={blogtitle}>
              <LinkedinIcon size={32} />
            </LinkedinShareButton>

            {/* {blog.author && (
              <span className="blog-author">By: {blog.author.displayName}</span>
            )} */}
          </div>
          <div className="blog-body">{blog.content}</div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
