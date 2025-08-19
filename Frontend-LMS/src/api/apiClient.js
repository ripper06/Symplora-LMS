import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3502/api/v1", // backend port
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default apiClient;
