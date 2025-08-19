const { LeaveService } = require("../services");
const { StatusCodes } = require("http-status-codes");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

const { applyLeave, validateLeave, getLeavesForEmployee, getAllLeaves } = LeaveService;

// Employee applies for leave
async function submitLeaveRequest(req, res) {
  try {
    const leave = await LeaveService.applyLeave(req.user.userId, req.body);
    SuccessResponse.data = leave;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    console.error('Leave Application Error:', error);
    ErrorResponse.error = error;
    return res.status(error.statusCode || 500).json(ErrorResponse);
  }
}

// HR approves/rejects leave
async function hrValidateLeave(req, res) {
  try {
    const leave = await validateLeave(req.params.id, req.body.action);
    SuccessResponse.data = leave;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode || 500).json(ErrorResponse);
  }
}

// Get leaves for an employee
async function getEmployeeLeaves(req, res) {
  try {
    const leaves = await getLeavesForEmployee(req.user.userId);
    SuccessResponse.data = leaves;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode || 500).json(ErrorResponse);
  }
}

// HR fetch all leaves
async function getAllLeaveRequests(req, res) {
  try {
    const leaves = await getAllLeaves();
    SuccessResponse.data = leaves;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode || 500).json(ErrorResponse);
  }
}

module.exports = {
  submitLeaveRequest,
  hrValidateLeave,
  getEmployeeLeaves,
  getAllLeaveRequests,
};
