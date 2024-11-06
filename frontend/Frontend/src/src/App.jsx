import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./components/Homepage";
import BlogTopic from "./components/BlogTopic";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact component={<Homepage />} /> // Corrected component
        name
        <Route path="/topic/:topic" component={<BlogTopic />} />
      </Routes>
    </Router>
  );
}

export default App;
