const { LeaveRepository, EmployeeRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");

const leaveRepository = new LeaveRepository();
const employeeRepository = new EmployeeRepository();

async function applyLeave(employeeId, { startDate, endDate, reason }) {
  try {
    // Fetch employee
  const employee = await employeeRepository.get(employeeId);
  if (!employee) {
    throw new AppError("Employee not found", StatusCodes.NOT_FOUND);
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Edge Case Checks
  if (start > end) {
    return leaveRepository.create({
      employeeId,
      startDate,
      endDate,
      reason,
      status: "REJECTED",
    });
  }

  if (start < new Date(employee.joiningDate)) {
    return leaveRepository.create({
      employeeId,
      startDate,
      endDate,
      reason,
      status: "REJECTED",
    });
  }

  const daysRequested = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
  if (daysRequested > employee.leaveBalance) {
    return leaveRepository.create({
      employeeId,
      startDate,
      endDate,
      reason,
      status: "REJECTED",
    });
  }

  // Check overlapping approved leaves
  const overlapping = await leaveRepository.getOverlappingLeaves(employeeId, startDate, endDate);
  if (overlapping.length) {
    return leaveRepository.create({
      employeeId,
      startDate,
      endDate,
      reason,
      status: "REJECTED",
    });
  }

  // All validations passed → create pending leave
  return leaveRepository.create({
    employeeId,
    startDate,
    endDate,
    reason,
    status: "PENDING",
  });
  } catch (error) {
    console.log('Services : ', error);
  }
}

// HR approves/rejects leave
async function validateLeave(leaveId, action) {
  const leave = await leaveRepository.get(leaveId);
  if (!leave) {
    throw new AppError("Leave request not found", StatusCodes.NOT_FOUND);
  }

  if (!["APPROVED", "REJECTED"].includes(action)) {
    throw new AppError("Invalid action. Use APPROVED or REJECTED", StatusCodes.BAD_REQUEST);
  }

  // On approval → deduct leave balance
  if (action === "APPROVED") {
    const employee = await employeeRepository.get(leave.employeeId);
    const days = Math.floor((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1;

    if (employee.leaveBalance < days) {
      // Not enough balance → automatically reject
      leave.status = "REJECTED";
      await leave.save();
      return leave;
    }

    employee.leaveBalance -= days;
    await employee.save();
  }

  leave.status = action;
  await leave.save();

  return leave;
}

// Get leaves for employee
async function getLeavesForEmployee(employeeId) {
  return leaveRepository.getByEmployee(employeeId);
}

// Get all leaves (HR)
async function getAllLeaves(filter = {}) {
  return leaveRepository.getAll(filter);
}

module.exports = {
  applyLeave,
  validateLeave,
  getLeavesForEmployee,
  getAllLeaves,
};
