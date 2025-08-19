import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import EmployeeDashboard from "./EmployeeDashboard";
import HRDashboard from "./HRDashboard";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="dashboard-container">
        <h1>Please log in to continue</h1>
      </div>
    );
  }

  if (user.role === "HR" || user.role === "ADMIN") {
    return <HRDashboard user={user} />;
  }

  return <EmployeeDashboard user={user} />;
};

export default Dashboard;
