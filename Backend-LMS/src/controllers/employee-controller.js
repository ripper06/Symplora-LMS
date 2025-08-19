const { EmployeeService } = require("../services");
const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, SuccessResponse } = require("../utils/common");

/*
 *   POST : /employees
 *   req-body { name, email, department, joiningDate }
 */
async function createEmployee(req, res) {
  try {
    const employee = await EmployeeService.createEmployee({
      name: req.body.name,
      email: req.body.email,
      emp_id : req.body.emp_id,
      department: req.body.department,
      joiningDate: req.body.joiningDate,
      leaveBalance : req.body.leaveBalance
    });
    SuccessResponse.data = employee;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode || 500).json(ErrorResponse);
  }
}

/*
 *   GET : /employees
 */
async function getEmployees(req, res) {
  try {
    const employees = await EmployeeService.getEmployees();
    SuccessResponse.data = employees;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode || 500).json(ErrorResponse);
  }
}

/*
 *   GET : /employees/:id
 */
async function getEmployee(req, res) {
  try {
    const employee = await EmployeeService.getEmployee(req.params.id);
    SuccessResponse.data = employee;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode || 500).json(ErrorResponse);
  }
}

/*
 *   PUT : /employees/:id
 */
async function updateEmployee(req, res) {
  try {
    const employee = await EmployeeService.updateEmployee(req.params.id, {
      name: req.body.name,
      email: req.body.email,
      department: req.body.department,
      joiningDate: req.body.joiningDate,
      leaveBalance: req.body.leaveBalance,
      lastTakenLeaveDate: req.body.lastTakenLeaveDate,
    });
    SuccessResponse.data = employee;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode || 500).json(ErrorResponse);
  }
}

/*
 *   DELETE : /employees/:id
 */
async function destroyEmployee(req, res) {
  try {
    const response = await EmployeeService.destroyEmployee(req.params.id);
    SuccessResponse.data = response;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode || 500).json(ErrorResponse);
  }
}

/*
 *   GET : /employees/:id/leave-balance
 */
async function getLeaveBalance(req, res) {
  try {
    const balance = await EmployeeService.getLeaveBalance(req.params.id);
    SuccessResponse.data = balance;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode || 500).json(ErrorResponse);
  }
}

module.exports = {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  destroyEmployee,
  getLeaveBalance,
};
