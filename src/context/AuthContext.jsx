import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api"; // ✅ Ensure correct path

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null); // { name }

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await api.get("/auth/profile"); // ✅ Get full profile
        setUser(res.data); // Includes name, email, profileimage, etc.
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setUser(null);
      }
    };

    if (token) {
      fetchUserInfo();
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    try {
      const res = await api.get("/auth/profile"); // ✅ Get full profile after login
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch profile during login:", err);
      const decoded = jwtDecode(token);
      setUser({ name: decoded.email }); // fallback
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
