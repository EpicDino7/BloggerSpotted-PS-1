import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "../StyleSheets/Navbar.css";

const Navbar = ({ showLoginButton }) => {
  const { user, login, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-title">
        BlogWebsite
      </Link>
      <div className="navbar-links">
        <Link to="/contact" className="navbar-link">
          Contact
        </Link>
        {showLoginButton &&
          (user ? (
            <button onClick={logout} className="navbar-link">
              Logout
            </button>
          ) : (
            <button onClick={login} className="navbar-link">
              Login
            </button>
          ))}
      </div>
    </nav>
  );
};

export default Navbar;
