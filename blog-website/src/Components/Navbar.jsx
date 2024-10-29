import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "../StyleSheets/Navbar.css";

const Navbar = ({ showLoginButton }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Update the return statement in the Navbar component
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
            <>
              <Link to="/profile" className="navbar-link">
                Profile
              </Link>
              <button onClick={logout} className="navbar-link">
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => navigate("/login")} className="navbar-link">
              Login
            </button>
          ))}
      </div>
    </nav>
  );
};

export default Navbar;
