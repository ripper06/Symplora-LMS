const express = require("express");
const { LeaveController } = require("../../controllers");
const { AuthMiddlewares } = require("../../middlewares");

const router = express.Router();

// Employee submits leave
router.post(
  "/apply",
  AuthMiddlewares.authenticateJWT,
  LeaveController.submitLeaveRequest
);

// Employee views own leaves
router.get(
  "/me",
  AuthMiddlewares.authenticateJWT,
  LeaveController.getEmployeeLeaves
);

// HR approves/rejects leave
router.put(
  "/:id/validate",
  AuthMiddlewares.authenticateJWT,
  AuthMiddlewares.authorizeRoles("HR"),
  LeaveController.hrValidateLeave
);

// HR views all leave requests
router.get(
  "/all",
  AuthMiddlewares.authenticateJWT,
  AuthMiddlewares.authorizeRoles("HR"),
  LeaveController.getAllLeaveRequests
);

module.exports = router;
