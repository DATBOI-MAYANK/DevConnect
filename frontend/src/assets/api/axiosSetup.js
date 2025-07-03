import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/users/api/v1/", // matches your backend routes
  timeout: 5000, // optional, adjust as needed
  withCredentials: true, // send cookies (for auth)
  headers: {
    "Content-Type": "application/json",
    // Add any custom headers if needed
  },
});

export default api;
