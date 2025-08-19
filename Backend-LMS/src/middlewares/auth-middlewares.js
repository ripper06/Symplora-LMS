const jwt = require("jsonwebtoken");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const { Logger } = require("../config");

/**
 * Validate that email and password exist in request body
 */
function validateCredentials(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    ErrorResponse.success = false;
    ErrorResponse.message = "Something went wrong during login...";
    ErrorResponse.error = new AppError(
      ["Required fields: email and password."],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  next();
}

/**
 * Authenticate JWT and attach payload to req.user
 */
function authenticateJWT(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ErrorResponse.success = false;
    ErrorResponse.message = "Missing token";
    ErrorResponse.error = new AppError("Missing token", StatusCodes.UNAUTHORIZED);
    return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, employeeId, role }
    next();
  } catch (error) {
    Logger.error("JWT verification failed:", error);
    ErrorResponse.success = false;
    ErrorResponse.message = "Invalid token";
    ErrorResponse.error = new AppError("Invalid token", StatusCodes.UNAUTHORIZED);
    return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
  }
}

/**
 * Authorize specific roles
 */
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      ErrorResponse.success = false;
      ErrorResponse.message = "Forbidden";
      ErrorResponse.error = new AppError("Forbidden", StatusCodes.FORBIDDEN);
      return res.status(StatusCodes.FORBIDDEN).json(ErrorResponse);
    }
    next();
  };
}

module.exports = {
  validateCredentials,
  authenticateJWT,
  authorizeRoles,
};
