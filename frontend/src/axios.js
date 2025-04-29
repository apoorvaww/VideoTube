import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000/api", // Replace with your backend API URL
  withCredentials: true
});

export default instance;
