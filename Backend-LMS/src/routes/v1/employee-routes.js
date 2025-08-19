const express = require("express");

const { EmployeeController } = require("../../controllers");
const { EmployeeMiddlewares,AuthMiddlewares } = require("../../middlewares");

const router = express.Router();

/*
 *   POST : /api/v1/employees
 *   req-body { name, email, emp_id, department, joiningDate }
 */
router.post(
  "/",
  AuthMiddlewares.authenticateJWT,
  AuthMiddlewares.authorizeRoles("HR"),
  EmployeeMiddlewares.validateCreateEmployee,
  EmployeeController.createEmployee
);

/*
 *   GET : /api/v1/employees
 */
router.get("/", 
  AuthMiddlewares.authenticateJWT,
  AuthMiddlewares.authorizeRoles("HR", "ADMIN"),
  EmployeeController.getEmployees);

/*
 *   GET : /api/v1/employees/:id
 */
router.get("/:id",
  AuthMiddlewares.authenticateJWT,
  EmployeeController.getEmployee);

/*
 *   PUT : /api/v1/employees/:id
 */
router.put(
  "/:id",
  AuthMiddlewares.authenticateJWT,
  AuthMiddlewares.authorizeRoles("HR", "ADMIN"),
  EmployeeMiddlewares.validateUpdateEmployee,
  EmployeeController.updateEmployee
);

/*
 *   DELETE : /api/v1/employees/:id
 */
router.delete("/:id", 
  AuthMiddlewares.authenticateJWT,
  AuthMiddlewares.authorizeRoles("HR", "ADMIN"),
  EmployeeController.destroyEmployee);

/*
 *   GET : /api/v1/employees/:id/leave-balance
 */
router.get("/:id/leave-balance", 
  AuthMiddlewares.authenticateJWT,
  EmployeeController.getLeaveBalance);

module.exports = router;
