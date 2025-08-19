import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getLeaveBalance,
  getEmployee,
} from "../api/employee";
import {
  getEmployeeLeaves,
  applyLeave,
} from "../api/leave";
import { changePassword } from "../api/auth";
import { logoutUser } from "../utils/auth"; // helper to clear tokens

const EmployeeDashboard = ({ user }) => {
  const [employee, setEmployee] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(0);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyForm, setApplyForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error
  const [submitLoading, setSubmitLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        // Fetch employee info
        const emp = await getEmployee(user.employeeId);
        setEmployee(emp);
        // Fetch leave balance
        const balance = await getLeaveBalance(user.employeeId);
        setLeaveBalance(balance.leaveBalance);
        // Fetch employee's leave requests
        const myLeaves = await getEmployeeLeaves(user.employeeId);
        setLeaves(myLeaves);
      } catch (err) {
        console.error("Error fetching employee dashboard data:", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          logoutUser();
          navigate("/");
        }
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.employeeId, navigate]);

  /** ---------------- APPLY LEAVE ---------------- */
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitLoading(true);
    try {
      const start = new Date(applyForm.startDate);
      const end = new Date(applyForm.endDate);
      // ✅ Edge Case Checks
      if (!applyForm.startDate || !applyForm.endDate || !applyForm.reason) {
        setMessage("All fields are required.");
        setMessageType("error");
        setSubmitLoading(false);
        return;
      }
      if (end < start) {
        setMessage("End date cannot be before start date.");
        setMessageType("error");
        setSubmitLoading(false);
        return;
      }
      if (start < new Date(employee.joiningDate)) {
        setMessage("Cannot apply leave before joining date.");
        setMessageType("error");
        setSubmitLoading(false);
        return;
      }
      const duration =
        Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      if (duration > leaveBalance) {
        setMessage("Not enough leave balance.");
        setMessageType("error");
        setSubmitLoading(false);
        return;
      }
      // Overlapping leave check
      const overlap = leaves.some(
        (l) =>
          (start >= new Date(l.startDate) && start <= new Date(l.endDate)) ||
          (end >= new Date(l.startDate) && end <= new Date(l.endDate))
      );
      if (overlap) {
        setMessage("Overlapping leave request exists.");
        setMessageType("error");
        setSubmitLoading(false);
        return;
      }
      // Submit to backend
      await applyLeave(applyForm);
      setMessage("Leave request submitted successfully!");
      setMessageType("success");
      setApplyForm({ startDate: "", endDate: "", reason: "" });
      // Refresh dashboard
      const balance = await getLeaveBalance(user.employeeId);
      setLeaveBalance(balance.leaveBalance);
      const myLeaves = await getEmployeeLeaves(user.employeeId);
      setLeaves(myLeaves);
    } catch (err) {
      console.error("Apply leave error:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        logoutUser();
        navigate("/");
      }
      setMessage("Failed to submit leave request.");
      setMessageType("error");
    } finally {
      setSubmitLoading(false);
    }
  };

  /** ---------------- CHANGE PASSWORD ---------------- */
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setPasswordLoading(true);
    try {
      if (!passwordForm.oldPassword || !passwordForm.newPassword) {
        setMessage("Both fields are required.");
        setMessageType("error");
        setPasswordLoading(false);
        return;
      }
      if (passwordForm.newPassword.length < 6) {
        setMessage("New password must be at least 6 characters.");
        setMessageType("error");
        setPasswordLoading(false);
        return;
      }
      await changePassword(passwordForm);
      setMessage("Password changed successfully.");
      setMessageType("success");
      setPasswordForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
      console.error("Password change error:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        logoutUser();
        navigate("/");
      }
      setMessage("Failed to change password.");
      setMessageType("error");
    } finally {
      setPasswordLoading(false);
    }
  };

  /** ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logoutUser();
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <div style={loadingSpinnerStyle}></div>
        <h1 style={{ fontWeight: 600, marginTop: "20px", color: "#666" }}>
          Loading Dashboard...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={errorCardStyle}>
          <h1 style={{ color: "#dc3545", fontWeight: 700, marginBottom: "16px" }}>
            Error
          </h1>
          <p style={{ color: "#dc3545", fontSize: "1.1rem", marginBottom: "20px" }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={retryButtonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerContainerStyle}>
        <h1 style={headerStyle}>
          Employee Dashboard - Welcome, {user.name}
        </h1>
        <button
          onClick={handleLogout}
          style={logoutButtonStyle}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c82333")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc3545")}
        >
          Logout
        </button>
      </div>

      {/* Employee Details Card */}
      <div style={cardStyle}>
        <h2 style={sectionHeaderStyle}>My Details</h2>
        <div style={detailsGridStyle}>
          <div style={detailItemStyle}>
            <span style={detailLabelStyle}>Email:</span>
            <span style={detailValueStyle}>{employee?.email}</span>
          </div>
          <div style={detailItemStyle}>
            <span style={detailLabelStyle}>Department:</span>
            <span style={detailValueStyle}>{employee?.department}</span>
          </div>
          <div style={detailItemStyle}>
            <span style={detailLabelStyle}>Joining Date:</span>
            <span style={detailValueStyle}>
              {new Date(employee?.joiningDate).toLocaleDateString()}
            </span>
          </div>
          <div style={detailItemStyle}>
            <span style={detailLabelStyle}>Leave Balance:</span>
            <span style={leaveBalanceStyle}>{leaveBalance} days</span>
          </div>
        </div>
      </div>

      {/* Apply Leave Form */}
      <div style={cardStyle}>
        <h2 style={sectionHeaderStyle}>Apply for Leave</h2>
        <form onSubmit={handleApplyLeave} style={formContainerStyle}>
          <div style={formRowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Start Date *</label>
              <input
                type="date"
                value={applyForm.startDate}
                onChange={(e) => setApplyForm({ ...applyForm, startDate: e.target.value })}
                style={inputStyle}
                required
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>End Date *</label>
              <input
                type="date"
                value={applyForm.endDate}
                onChange={(e) => setApplyForm({ ...applyForm, endDate: e.target.value })}
                style={inputStyle}
                required
              />
            </div>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Reason *</label>
            <textarea
              placeholder="Enter reason for leave"
              value={applyForm.reason}
              onChange={(e) => setApplyForm({ ...applyForm, reason: e.target.value })}
              style={textareaStyle}
              rows="4"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitLoading}
            style={submitLoading ? { ...submitButtonStyle, ...disabledButtonStyle } : submitButtonStyle}
            onMouseEnter={(e) => !submitLoading && (e.currentTarget.style.backgroundColor = "#0056b3")}
            onMouseLeave={(e) => !submitLoading && (e.currentTarget.style.backgroundColor = "#007bff")}
          >
            {submitLoading ? "Submitting..." : "Submit Leave Request"}
          </button>
        </form>
        
        {message && (
          <div style={getMessageStyle(messageType)}>
            {message}
          </div>
        )}
      </div>

      {/* Leave Requests Table */}
      <div style={cardStyle}>
        <h2 style={sectionHeaderStyle}>My Leave Requests</h2>
        {leaves.length === 0 ? (
          <p style={emptyStateStyle}>No leave requests found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderStyle}>
                  {["Start Date", "End Date", "Reason", "Status"].map((header) => (
                    <th key={header} style={thStyle}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leaves.map((l) => (
                  <tr
                    key={l.id}
                    style={tableRowStyle}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f8f9fa")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "")
                    }
                  >
                    <td style={tdStyle}>
                      {new Date(l.startDate).toLocaleDateString()}
                    </td>
                    <td style={tdStyle}>
                      {new Date(l.endDate).toLocaleDateString()}
                    </td>
                    <td style={tdStyle}>{l.reason}</td>
                    <td style={tdStyle}>
                      <span style={getStatusBadgeStyle(l.status)}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div style={cardStyle}>
        <h2 style={sectionHeaderStyle}>Change Password</h2>
        <form onSubmit={handleChangePassword} style={passwordFormStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Current Password *</label>
            <input
              type="password"
              placeholder="Enter current password"
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              style={inputStyle}
              required
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>New Password *</label>
            <input
              type="password"
              placeholder="Enter new password (min 6 characters)"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              style={inputStyle}
              minLength="6"
              required
            />
          </div>
          <button
            type="submit"
            disabled={passwordLoading}
            style={passwordLoading ? { ...changePasswordButtonStyle, ...disabledButtonStyle } : changePasswordButtonStyle}
            onMouseEnter={(e) => !passwordLoading && (e.currentTarget.style.backgroundColor = "#218838")}
            onMouseLeave={(e) => !passwordLoading && (e.currentTarget.style.backgroundColor = "#28a745")}
          >
            {passwordLoading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Helper function for status badge styles
const getStatusBadgeStyle = (status) => ({
  padding: "6px 12px",
  borderRadius: "20px",
  fontWeight: "600",
  fontSize: "0.85rem",
  display: "inline-block",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  backgroundColor:
    status === "APPROVED"
      ? "#d4edda"
      : status === "REJECTED"
      ? "#f8d7da"
      : "#fff3cd",
  color:
    status === "APPROVED"
      ? "#155724"
      : status === "REJECTED"
      ? "#721c24"
      : "#856404",
  border: `1px solid ${
    status === "APPROVED"
      ? "#c3e6cb"
      : status === "REJECTED"
      ? "#f5c6cb"
      : "#ffeaa7"
  }`,
});

// Helper function for message styles
const getMessageStyle = (type) => ({
  marginTop: "20px",
  padding: "12px 16px",
  borderRadius: "8px",
  fontSize: "1rem",
  fontWeight: "500",
  backgroundColor: type === "success" ? "#d4edda" : "#f8d7da",
  color: type === "success" ? "#155724" : "#721c24",
  border: `1px solid ${type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
});

// Main Styles
const containerStyle = {
  padding: "20px",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  backgroundColor: "#f8f9fa",
  minHeight: "100vh",
  color: "#343a40",
};
const loadingContainerStyle = {
  ...containerStyle,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
};
const loadingSpinnerStyle = {
  width: "40px",
  height: "40px",
  border: "4px solid #f3f3f3",
  borderTop: "4px solid #007bff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};
const errorCardStyle = {
  backgroundColor: "#ffffff",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  border: "1px solid #f8d7da",
  maxWidth: "500px",
  margin: "0 auto",
  textAlign: "center",
};
const headerContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
  flexWrap: "wrap",
  gap: "20px",
};
const headerStyle = {
  fontWeight: "700",
  fontSize: "2.2rem",
  color: "#212529",
  background: "linear-gradient(135deg, #007bff, #0056b3)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  margin: 0,
};
const cardStyle = {
  marginBottom: "30px",
  backgroundColor: "#ffffff",
  padding: "30px",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  border: "1px solid #e9ecef",
};
const sectionHeaderStyle = {
  fontWeight: "700",
  fontSize: "1.6rem",
  marginBottom: "24px",
  color: "#495057",
  borderBottom: "3px solid #007bff",
  paddingBottom: "8px",
  display: "inline-block",
};
const detailsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
};
const detailItemStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  padding: "16px",
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  border: "1px solid #e9ecef",
};
const detailLabelStyle = {
  fontSize: "0.9rem",
  fontWeight: "600",
  color: "#6c757d",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};
const detailValueStyle = {
  fontSize: "1.1rem",
  fontWeight: "600",
  color: "#343a40",
};
const leaveBalanceStyle = {
  ...detailValueStyle,
  color: "#28a745",
  fontSize: "1.3rem",
};
const formContainerStyle = {
  maxWidth: "600px",
};
const formRowStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
  marginBottom: "20px",
};
const formGroupStyle = {
  marginBottom: "20px",
};
const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
  color: "#495057",
  fontSize: "0.95rem",
};
const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "8px",
  border: "2px solid #e9ecef",
  fontSize: "1rem",
  outline: "none",
  backgroundColor: "#fff",
  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  boxSizing: "border-box",
};
const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  minHeight: "100px",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};
const submitButtonStyle = {
  padding: "12px 24px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 8px rgba(0, 123, 255, 0.3)",
  width: "100%",
  maxWidth: "200px",
};
const changePasswordButtonStyle = {
  padding: "12px 24px",
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 8px rgba(40, 167, 69, 0.3)",
  width: "100%",
  maxWidth: "200px",
};
const logoutButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#dc3545",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 8px rgba(220, 53, 69, 0.3)",
};
const retryButtonStyle = {
  padding: "12px 24px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 8px rgba(0, 123, 255, 0.3)",
};
const disabledButtonStyle = {
  backgroundColor: "#6c757d",
  cursor: "not-allowed",
  boxShadow: "none",
};
const passwordFormStyle = {
  maxWidth: "400px",
};
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
};
const tableHeaderStyle = {
  background: "linear-gradient(135deg, #007bff, #0056b3)",
  color: "#fff",
  fontWeight: "600",
};
const tableRowStyle = {
  transition: "background-color 0.3s ease",
  borderBottom: "1px solid #e9ecef",
};
const thStyle = {
  padding: "16px 20px",
  textAlign: "left",
  whiteSpace: "nowrap",
  fontSize: "0.95rem",
  letterSpacing: "0.5px",
};
const tdStyle = {
  padding: "16px 20px",
  borderBottom: "1px solid #e9ecef",
  whiteSpace: "nowrap",
  fontSize: "0.95rem",
};
const emptyStateStyle = {
  fontStyle: "italic",
  color: "#6c757d",
  textAlign: "center",
  padding: "40px",
  fontSize: "1.1rem",
};
// Add CSS animation for loading spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  input:focus, textarea:focus, select:focus {
    border-color: #007bff !important;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
  }
`;
document.head.appendChild(style);

export default EmployeeDashboard;
