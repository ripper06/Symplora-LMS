import apiClient from "./apiClient";

// HR/Admin - Get all employees
export const getEmployees = async () => {
  const res = await apiClient.get("/employees");
  return res.data.data;
};

// Get specific employee by ID
export const getEmployee = async (id) => {
  const res = await apiClient.get(`/employees/${id}`);
  return res.data.data;
};

// HR - Create new employee
export const createEmployee = async (employeeData) => {
  const res = await apiClient.post("/employees", employeeData);
  return res.data.data;
};

// HR/Admin - Update employee
export const updateEmployee = async (id, employeeData) => {
  const res = await apiClient.put(`/employees/${id}`, employeeData);
  return res.data.data;
};

// HR/Admin - Delete employee
export const deleteEmployee = async (id) => {
  const res = await apiClient.delete(`/employees/${id}`);
  return res.data.data;
};

// Get leave balance of employee
export const getLeaveBalance = async (id) => {
  const res = await apiClient.get(`/employees/${id}/leave-balance`);
  return res.data.data;
};
