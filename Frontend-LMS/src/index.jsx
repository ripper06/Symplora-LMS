import React from "react";
import ReactDOM from "react-dom/client"; // ✅ notice /client
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "./styles.css";

// create a root
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
