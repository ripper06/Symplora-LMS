import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3501/api/v1",
});

export default apiClient;