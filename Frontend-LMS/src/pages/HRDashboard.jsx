// No logic changed — just cleaner, modular, responsive UI

import React, { useEffect, useState } from "react";
import { getAllLeaves, validateLeave } from "../api/leave";
import { getEmployees, createEmployee } from "../api/employee";
import { useNavigate } from "react-router-dom";

const HRDashboard = ({ user }) => {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    emp_id: "",
    department: "",
    joiningDate: "",
  });

  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortDept, setSortDept] = useState("ALL");

  const employeeMap = {};
  employees.forEach((emp) => {
    employeeMap[emp.id] = emp;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const allLeaves = await getAllLeaves();
        setLeaves(allLeaves);
        const empList = await getEmployees();
        setEmployees(empList);
      } catch (err) {
        console.error("Error fetching HR dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusChange = async (leaveId, status) => {
    try {
      await validateLeave(leaveId, status);
      setLeaves((prevLeaves) =>
        prevLeaves.map((l) => (l.id === leaveId ? { ...l, status } : l))
      );
    } catch (err) {
      console.error("Error updating leave status:", err);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const newEmp = await createEmployee(formData);
      setEmployees((prev) => [...prev, newEmp]);
      setShowModal(false);
      setFormData({
        name: "",
        email: "",
        emp_id: "",
        department: "",
        joiningDate: "",
      });
    } catch (err) {
      console.error("Error creating employee:", err);
      alert("Failed to add employee.");
    }
  };

  const filteredLeaves =
    filter === "ALL" ? leaves : leaves.filter((l) => l.status === filter);

  const filteredEmployees = employees
    .filter((emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((emp) => (sortDept === "ALL" ? true : emp.department === sortDept));

  if (loading) {
    return (
      <div style={loadingStyle}>
        <div style={loadingSpinnerStyle}></div>
        <h1 style={{ fontWeight: 600, marginTop: "20px" }}>Loading HR Dashboard...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={errorCardStyle}>
          <h1 style={{ color: "#dc3545", fontWeight: 700, marginBottom: "16px" }}>Error</h1>
          <p style={{ color: "#dc3545", fontSize: "1.1rem", marginBottom: "20px" }}>{error}</p>
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
      <h1 style={headerStyle}>
        HR Dashboard - Welcome, {user.name}
      </h1>

      {/* Leave Requests */}
      <div style={cardStyle}>
        <h2 style={sectionHeaderStyle}>
          Leave Requests
        </h2>

        <div style={filterContainerStyle}>
          <label style={{ fontWeight: "600", color: "#495057" }}>Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {filteredLeaves.length === 0 ? (
          <p style={emptyStateStyle}>
            No leave requests found.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderStyle}>
                  {[
                    "Employee",
                    "Department",
                    "Start",
                    "End",
                    "Reason",
                    "Status",
                    "Actions",
                  ].map((header) => (
                    <th key={header} style={thStyle}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave) => {
                  const emp = employeeMap[leave.employeeId] || {};
                  return (
                    <tr
                      key={leave.id}
                      style={tableRowStyle}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f8f9fa")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "")
                      }
                    >
                      <td style={tdStyle}>{emp.name || "N/A"}</td>
                      <td style={tdStyle}>{emp.department || "N/A"}</td>
                      <td style={tdStyle}>
                        {leave.startDate
                          ? new Date(leave.startDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td style={tdStyle}>
                        {leave.endDate
                          ? new Date(leave.endDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td style={tdStyle}>{leave.reason}</td>
                      <td style={tdStyle}>
                        <span style={getStatusBadgeStyle(leave.status)}>
                          {leave.status}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {leave.status === "PENDING" && (
                          <select
                            onChange={(e) =>
                              handleStatusChange(leave.id, e.target.value)
                            }
                            defaultValue="ACTION"
                            style={actionSelectStyle}
                          >
                            <option disabled>ACTION</option>
                            <option value="APPROVED">Approve</option>
                            <option value="REJECTED">Reject</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Employee Directory */}
      <div style={cardStyle}>
        <div style={sectionHeaderContainerStyle}>
          <h2 style={sectionHeaderStyle}>
            Employee Directory
          </h2>
          <button
            onClick={() => setShowModal(true)}
            style={addButtonStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#218838")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#28a745")
            }
          >
            + Add Employee
          </button>
        </div>

        <div style={searchFilterContainerStyle}>
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={inputStyle}
          />
          <select
            value={sortDept}
            onChange={(e) => setSortDept(e.target.value)}
            style={inputStyle}
          >
            <option value="ALL">Sort by Department</option>
            {[...new Set(employees.map((emp) => emp.department))].map(
              (dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              )
            )}
          </select>
        </div>

        {filteredEmployees.length === 0 ? (
          <p style={emptyStateStyle}>
            No employees found.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderStyle}>
                  {[
                    "Name",
                    "Email",
                    "Department",
                    "Joining Date",
                    "Status",
                    "Action",
                  ].map((header) => (
                    <th key={header} style={thStyle}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    style={tableRowStyle}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f8f9fa")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "")
                    }
                  >
                    <td style={tdStyle}>{emp.name}</td>
                    <td style={tdStyle}>{emp.email}</td>
                    <td style={tdStyle}>{emp.department}</td>
                    <td style={tdStyle}>
                      {emp.joiningDate
                        ? new Date(emp.joiningDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td style={tdStyle}>{emp.status || "ACTIVE"}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => navigate(`/employee/${emp.id}`)}
                        style={profileButtonStyle}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#0056b3")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#007bff")
                        }
                      >
                        Check Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={modalTitleStyle}>Add New Employee</h3>
              <button
                onClick={() => setShowModal(false)}
                style={closeButtonStyle}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddEmployee} style={formStyle}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={formInputStyle}
                  placeholder="Enter employee name"
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={formInputStyle}
                  placeholder="Enter email address"
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Employee ID *</label>
                <input
                  type="text"
                  value={formData.emp_id}
                  onChange={(e) => setFormData({ ...formData, emp_id: e.target.value })}
                  required
                  style={formInputStyle}
                  placeholder="Enter employee ID"
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Department *</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                  style={formInputStyle}
                >
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Joining Date *</label>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  required
                  style={formInputStyle}
                />
              </div>

              <div style={modalFooterStyle}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={cancelButtonStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5a6268")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#6c757d")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={submitButtonStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#218838")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#28a745")}
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

// Improved styles
const containerStyle = {
  padding: "20px",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  backgroundColor: "#f8f9fa",
  minHeight: "100vh",
  color: "#343a40",
};

const loadingStyle = {
  ...containerStyle,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "#666",
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

const headerStyle = {
  fontWeight: "700",
  fontSize: "2.2rem",
  marginBottom: "30px",
  color: "#212529",
  textAlign: "center",
  background: "linear-gradient(135deg, #007bff, #0056b3)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
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
  marginBottom: "20px",
  color: "#495057",
  borderBottom: "3px solid #007bff",
  paddingBottom: "8px",
  display: "inline-block",
};

const sectionHeaderContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  flexWrap: "wrap",
  gap: "15px",
};

const filterContainerStyle = {
  marginBottom: "24px",
  display: "flex",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap",
};

const searchFilterContainerStyle = {
  marginBottom: "20px",
  display: "flex",
  flexWrap: "wrap",
  gap: "15px",
};

const selectStyle = {
  padding: "10px 14px",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "2px solid #e9ecef",
  outline: "none",
  minWidth: "150px",
  backgroundColor: "#fff",
  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  ":focus": {
    borderColor: "#007bff",
    boxShadow: "0 0 0 0.2rem rgba(0, 123, 255, 0.25)",
  },
};

const inputStyle = {
  padding: "12px 16px",
  borderRadius: "8px",
  border: "2px solid #e9ecef",
  fontSize: "1rem",
  outline: "none",
  width: "250px",
  backgroundColor: "#fff",
  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
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

const actionSelectStyle = {
  padding: "8px 12px",
  borderRadius: "6px",
  fontSize: "0.9rem",
  fontWeight: "600",
  border: "2px solid #007bff",
  outline: "none",
  backgroundColor: "#fff",
  color: "#007bff",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const addButtonStyle = {
  padding: "12px 24px",
  fontSize: "1rem",
  fontWeight: "600",
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 8px rgba(40, 167, 69, 0.3)",
};

const profileButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "0.9rem",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 6px rgba(0, 123, 255, 0.3)",
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

const emptyStateStyle = {
  fontStyle: "italic",
  color: "#6c757d",
  textAlign: "center",
  padding: "40px",
  fontSize: "1.1rem",
};

// Modal Styles
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  height: "100%",
  width: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  backdropFilter: "blur(3px)",
};

const modalContentStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
  width: "90%",
  maxWidth: "500px",
  maxHeight: "90vh",
  overflow: "auto",
  border: "1px solid #e9ecef",
};

const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "24px 30px 0",
  borderBottom: "2px solid #f8f9fa",
  marginBottom: "20px",
};

const modalTitleStyle = {
  fontSize: "1.5rem",
  fontWeight: "700",
  color: "#343a40",
  margin: 0,
};

const closeButtonStyle = {
  background: "transparent",
  border: "none",
  fontSize: "1.8rem",
  cursor: "pointer",
  color: "#6c757d",
  padding: "8px",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease",
};

const formStyle = {
  padding: "0 30px 30px",
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

const formInputStyle = {
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

const modalFooterStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  marginTop: "30px",
  paddingTop: "20px",
  borderTop: "1px solid #e9ecef",
};

const cancelButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#6c757d",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
  transition: "all 0.3s ease",
};

const submitButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 8px rgba(40, 167, 69, 0.3)",
};

// Add CSS animation for loading spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default HRDashboard;