const { StatusCodes } = require("http-status-codes");

const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");

/*
 * Validate Create Employee
 */
function validateCreateEmployee(req, res, next) {
  const { name, email, emp_id, department, joiningDate } = req.body;

  if (!name || !email || !emp_id || !department || !joiningDate) {
    ErrorResponse.message = "Something went wrong while creating the employee...";
    ErrorResponse.error = new AppError(
      ["Required fields: name, email, emp_id, department, joiningDate"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  // validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    ErrorResponse.message = "Something went wrong while creating the employee...";
    ErrorResponse.error = new AppError(
      ["Invalid email format"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  if (req.body.leaveBalance !== undefined && isNaN(Number(req.body.leaveBalance))) {
  ErrorResponse.message = "Something went wrong while creating the employee...";
  ErrorResponse.error = new AppError(
    ["Leave balance must be a number"],
    StatusCodes.BAD_REQUEST
  );
  return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
}

  next();
}

/*
 * Validate Update Employee
 * (only validate provided fields, since PATCH is partial update)
 */
function validateUpdateEmployee(req, res, next) {
  const { email, leaveBalance, name } = req.body;

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      ErrorResponse.message =
        "Something went wrong while updating the employee...";
      ErrorResponse.error = new AppError(
        ["Invalid email format"],
        StatusCodes.BAD_REQUEST
      );
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
  }

  if (leaveBalance !== undefined && isNaN(Number(leaveBalance))) {
    ErrorResponse.message =
      "Something went wrong while updating the employee...";
    ErrorResponse.error = new AppError(
      ["Leave balance must be a number"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  if (name && name.trim().length === 0) {
    ErrorResponse.message =
      "Something went wrong while updating the employee...";
    ErrorResponse.error = new AppError(
      ["Name cannot be empty"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  next();
}

module.exports = {
  validateCreateEmployee,
  validateUpdateEmployee,
};
