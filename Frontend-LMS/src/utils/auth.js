// utils/auth.js

// Save JWT token
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// Get JWT token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Remove JWT token and logout
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); 
};
