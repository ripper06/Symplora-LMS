import apiClient from "./apiClient";

export const login = async (email, password) => {
  const res = await apiClient.post("/auth/login", { email, password });
  return res.data.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  const res = await apiClient.post("/auth/change-password", { oldPassword, newPassword });
  return res.data.data;
};
