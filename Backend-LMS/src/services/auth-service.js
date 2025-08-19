const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const {ServerConfig} = require('../config')

const userRepository = new UserRepository();

async function login(data) {
  try {
    const { email, password } = data;
    const user = await userRepository.getByEmail(email);

    if (!user) {
      throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    const payload = {
      userId: user.id,
      employeeId: user.employeeId,
      role: user.role,
    };

    const token = jwt.sign(
        payload, 
        ServerConfig.JWT_SECRET, 
        {
            expiresIn: ServerConfig.JWT_EXPIRES || "1h",
        }
    );

    return { token, user: payload };

  } catch (error) {
    // Log actual error for debugging
    console.error("Error in login:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to login",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function changePassword(userId, oldPassword, newPassword) {
  try {
    const user = await userRepository.get(userId);

    const validPassword = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!validPassword) {
      throw new AppError("Old password is incorrect", StatusCodes.UNAUTHORIZED);
    }

    const saltRounds = Number(ServerConfig.BCRYPT_SALT_ROUNDS || 10);
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
33
    await userRepository.update(userId, { passwordHash, isFirstLogin: false });

    return { message: "Password updated successfully" };

  } catch (error) {
    console.error("Error in changePassword:", error);
    if (error instanceof AppError) {
      throw error;
    }
    if (error.name === "SequelizeValidationError" || error.name === "SequelizeDatabaseError") {
        throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }

    throw new AppError(
      "Failed to change password",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  login,
  changePassword,
};
