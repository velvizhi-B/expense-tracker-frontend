import axios from "axios";

// Get the base URL from environment variables
// const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ For Vite
  withCredentials: true, // ✅ Sends cookies like JWT (important for auth)
  headers: {
    "Content-Type": "application/json", // ✅ Standard for JSON APIs
  },
});

// Attach token to every request (if exists)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
