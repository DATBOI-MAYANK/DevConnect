import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/users/api/v1/", 
  timeout: 5000, 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
