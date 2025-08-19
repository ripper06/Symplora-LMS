import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployees, deleteEmployee } from "../api/employee";
import { getAllLeaves } from "../api/leave";

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const empList = await getEmployees();
        const emp = empList.find(e => e.id === parseInt(id));
        setEmployee(emp);

        const allLeaves = await getAllLeaves();
        setLeaves(allLeaves.filter(l => l.employeeId === parseInt(id)));
      } catch (err) {
        console.error(err);
        setError("Failed to load employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRemove = async () => {
    const confirm = window.confirm("Are you sure you want to remove this employee?");
    if (!confirm) return;

    try {
      await deleteEmployee(employee.id);
      alert("Employee removed successfully");
      navigate("/hr-dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to remove employee");
    }
  };

  // Dynamic CSS: function to return style based on leave status
  const getLeaveRowStyle = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return { backgroundColor: "#d4edda" }; // light green
      case "pending":
        return { backgroundColor: "#fff3cd" }; // light yellow
      case "rejected":
        return { backgroundColor: "#f8d7da" }; // light red
      default:
        return {};
    }
  };

  if (loading) return <h1>Loading employee data...</h1>;
  if (error) return <h1 style={{ color: "red" }}>{error}</h1>;
  if (!employee) return <h1>Employee not found</h1>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{employee.name} - Profile</h1>
      <p><strong>Email:</strong> {employee.email}</p>
      <p><strong>Department:</strong> {employee.department}</p>
      <p><strong>Joining Date:</strong> {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : "N/A"}</p>
      <p><strong>Employee-ID:</strong> { employee.emp_id}</p>

      <h2>Leaves</h2>
      {leaves.length === 0 ? (
        <p>No leaves found</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Start Date</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>End Date</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Reason</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map(l => (
              <tr key={l.id} style={getLeaveRowStyle(l.status)}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{new Date(l.startDate).toLocaleDateString()}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{new Date(l.endDate).toLocaleDateString()}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{l.reason}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{l.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
        onClick={handleRemove}
      >
        Remove Employee
      </button>
    </div>
  );
};

export default EmployeeDetailPage;
