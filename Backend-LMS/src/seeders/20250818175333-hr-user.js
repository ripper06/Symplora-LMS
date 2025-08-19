"use strict";
const bcrypt = require("bcrypt");
const {ServerConfig} = require('../config')

module.exports = {
  async up(queryInterface, Sequelize) {
    const password = ServerConfig.HR_PASSWORD; // default HR password
    const saltRounds = Number(ServerConfig.BCRYPT_SALT_ROUNDS) || 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await queryInterface.bulkInsert("Users", [
      {
        email: ServerConfig.HR_EMAIL,
        passwordHash,
        role: "HR",
        employeeId: null, // HR not linked to Employee
        isFirstLogin: false, // HR can log in immediately
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", { email: "hr@company.com" });
  },
};
