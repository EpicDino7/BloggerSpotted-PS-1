import React, { useState } from "react";
import axios from "axios";
import "../StyleSheets/NewBlogPost.css";

const API_URL = "http://localhost:5000/api";

const NewBlogPost = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content });
    setTitle("");
    setContent("");
    setOriginalContent("");
  };

  const enhanceContent = async () => {
    if (!content.trim()) return;

    setIsEnhancing(true);
    setOriginalContent(content); // Save original content

    try {
      const response = await axios.post(
        `${API_URL}/ai/enhance`,
        { content },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.enhancedContent) {
        setContent(response.data.enhancedContent);
      } else {
        console.error("No enhanced content in response:", response.data);
        throw new Error("No enhanced content received");
      }
    } catch (error) {
      console.error("Error enhancing content:", error);
      if (error.response) {
        console.error("Server error:", error.response.data);
        alert(
          `Failed to enhance content: ${
            error.response.data.message || "Unknown error"
          }`
        );
      } else {
        alert("Failed to enhance content. Please try again.");
      }
    } finally {
      setIsEnhancing(false);
    }
  };
  const revertContent = () => {
    if (originalContent) {
      setContent(originalContent);
      setOriginalContent("");
    }
  };

  return (
    <div className="new-blog-post">
      <h2>Create New Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <div className="enhancement-buttons">
          <button
            type="button"
            onClick={enhanceContent}
            disabled={isEnhancing || !content.trim()}
            className={`enhance-btn ${isEnhancing ? "enhancing" : ""}`}
          >
            {isEnhancing ? (
              <>
                <span className="spinner"></span>
                Enhancing...
              </>
            ) : (
              "Enhance with AI"
            )}
          </button>
          {originalContent && (
            <button
              type="button"
              onClick={revertContent}
              className="revert-btn"
            >
              Revert Changes
            </button>
          )}
        </div>
        <div className="form-buttons">
          <button type="submit">Post</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewBlogPost;
