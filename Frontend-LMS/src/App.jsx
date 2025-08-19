import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";        // will create later
import Dashboard from "./pages/Dashboard"; // will create later
import EmployeeDetailPage from "./pages/EmployeeDetailPage";
import HRDashboard from "./pages/HRDashboard";

const App = () => (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/employee/:id" element={<EmployeeDetailPage />} />
      <Route path="/hr-dashboard" element={<HRDashboard/>} />
    </Routes>
  </BrowserRouter>
);

export default App;
