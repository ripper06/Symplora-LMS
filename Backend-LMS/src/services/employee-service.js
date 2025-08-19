const { EmployeeRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const { Mailer } = require("../utils/common");
const {createUserForEmployee} = require('./user-service');

const sendMail = Mailer.sendEmployeeWelcomeMail

const employeeRepository = new EmployeeRepository();

async function createEmployee(data) {
  try {
    
    const employee = await employeeRepository.create(data);

    
    await createUserForEmployee(employee);

    return employee;

  } catch (error) {
    //console.error("Error in create:", error);
    //console.log('error name : ', error);

    // Sequelize Validation (null, length, datatype mismatch from model)
    if (error.name === "SequelizeValidationError") {
      let explanation = error.errors.map((err) => err.message);
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }

    // Sequelize DB-level errors (wrong datatype like "jo" into INT)
    if (error.name === "SequelizeDatabaseError") {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }

    // Sequelize unique constraint (duplicate email/emp_id)
    if (error.name === "SequelizeUniqueConstraintError") {
      // extract field info
      const fields = Object.keys(error.fields || {});
      let msg = fields.length
        ? `${fields.join(", ")} already exists`
        : "Duplicate value entered";
      throw new AppError(msg, StatusCodes.CONFLICT); // 409 Conflict
    }

    throw new AppError("Cannot create a new Employee object", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function getEmployees() {
  try {
    const employees = await employeeRepository.getAll();
    return employees;
  } catch (error) {
    throw new AppError(
      "Cannot fetch employees",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getEmployee(id) {
  try {
    const employee = await employeeRepository.get(id);
    return employee;
  } catch (error) {
    if (error.statusCode == StatusCodes.NOT_FOUND) {
      throw new AppError("Employee not found", error.statusCode);
    }
    throw new AppError(
      "Cannot fetch employee details",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function updateEmployee(id, data) {
  try {
    const updated = await employeeRepository.update(id, data);
    return updated;
  } catch (error) {
    if (error.statusCode == StatusCodes.NOT_FOUND) {
      throw new AppError("Employee not found", error.statusCode);
    }

    //console.error("Error in create:", error);
    //console.log('error name : ', error);

    // Sequelize Validation (null, length, datatype mismatch from model)
    if (error.name === "SequelizeValidationError") {
      let explanation = error.errors.map((err) => err.message);
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }

    // Sequelize DB-level errors (wrong datatype like "jo" into INT)
    if (error.name === "SequelizeDatabaseError") {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }

    // Sequelize unique constraint (duplicate email/emp_id)
    if (error.name === "SequelizeUniqueConstraintError") {
      // extract field info
      const fields = Object.keys(error.fields || {});
      let msg = fields.length
        ? `${fields.join(", ")} already exists`
        : "Duplicate value entered";
      throw new AppError(msg, StatusCodes.CONFLICT); // 409 Conflict
    }
  
    throw new AppError(
      "Cannot update employee",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function destroyEmployee(id) {
  try {
    const response = await employeeRepository.destroy(id);
    return response;
  } catch (error) {
    if (error.statusCode == StatusCodes.NOT_FOUND) {
      throw new AppError("Employee not found", error.statusCode);
    }
    throw new AppError(
      "Cannot delete employee",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getLeaveBalance(id) {
  try {
    const employee = await employeeRepository.get(id);
    return { leaveBalance: employee.leaveBalance };
  } catch (error) {
    if (error.statusCode == StatusCodes.NOT_FOUND) {
      throw new AppError("Employee not found", error.statusCode);
    }
    throw new AppError(
      "Cannot fetch leave balance",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
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
