import React from "react";
import "../StyleSheets/Login.css";

const Login = () => {
  const handleGoogleLogin = () => {
    window.location = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="login-container">
      <h2>Login to BlogWebsite</h2>
      <p>Sign in with your Google account to post blogs</p>
      <button onClick={handleGoogleLogin} className="google-login-btn">
        Login with Google
      </button>
    </div>
  );
};

export default Login;
