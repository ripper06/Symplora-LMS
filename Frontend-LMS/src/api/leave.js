import apiClient from "./apiClient";

// Employee - Apply leave
export const applyLeave = async (leaveData) => {
  const res = await apiClient.post("/leaves/apply", leaveData);
  return res.data.data;
};

// Employee - Get own leaves
export const getEmployeeLeaves = async () => {
  const res = await apiClient.get("/leaves/me");
  return res.data.data;
};

// HR - Validate leave
export const validateLeave = async (id, action) => {
  const res = await apiClient.put(`/leaves/${id}/validate`, { action }); // action = "APPROVE" | "REJECT"
  return res.data.data;
};

// HR - Get all leave requests
export const getAllLeaves = async () => {
  const res = await apiClient.get("/leaves/all");
  return res.data.data;
};
