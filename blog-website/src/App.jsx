import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Components/HomePage";
import BlogTopicPage from "./Components/BlogTopicPage";
import BlogPost from "./Components/BlogPost";
import Login from "./Components/Login";
import { AuthProvider } from "./AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/topic/:topic" element={<BlogTopicPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blog/:id" element={<BlogPost />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
