const { UserRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const { Mailer } = require("../utils/common");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { ServerConfig } = require("../config");

const userRepository = new UserRepository();
const sendMail = Mailer.sendEmployeeWelcomeMail;

async function createUserForEmployee(employee) {
  try {
    // 1️⃣ Generate random temporary password
    const tempPassword = crypto
      .randomBytes(6)
      .toString("base64")
      .replace(/[+/=]/g, "A"); // 8-10 chars safe for email

    const passwordHash = await bcrypt.hash(tempPassword, Number(ServerConfig.BCRYPT_SALT_ROUNDS || 10));

    // 2️⃣ Create User
    await userRepository.create({
      email: employee.email,
      passwordHash,
      role: "EMPLOYEE",
      employeeId: employee.id,
      isFirstLogin: true,
    });

    // 3️⃣ Send welcome email with temp password
    await sendMail({
      ...employee.toJSON(),
      tempPassword
    });

  } catch (error) {
    console.error("Error in createUserForEmployee:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new AppError("User with this email already exists", StatusCodes.CONFLICT);
    }
    throw new AppError("Failed to create User for employee", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  createUserForEmployee,
};
