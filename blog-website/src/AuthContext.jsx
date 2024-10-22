import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/current_user",
        { withCredentials: true }
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error checking user status:", error);
      setUser(null);
    }
  };

  const login = async () => {
    window.location = "http://localhost:5000/api/auth/google";
  };

  const logout = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/logout", {
        withCredentials: true,
      });
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
