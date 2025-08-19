const { StatusCodes } = require('http-status-codes');
const { Logger } = require('../config');
const AppError = require('../utils/errors/app-error');

class CrudRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    try {
      const response = await this.model.create(data);
      return response;
    } catch (error) {
      Logger.error("Error in create:", error);
      if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError" ||
      error.name === "SequelizeDatabaseError"
    ) {
      throw error;
    }
      throw new AppError("Failed to create resource", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async destroy(id) {
    try {
      const response = await this.model.destroy({
        where: { id }
      });
      if (!response) {
        throw new AppError("Resource not found", StatusCodes.NOT_FOUND);
      }
      return { deleted: true };
    } catch (error) {
      Logger.error("Error in destroy:", error);
      throw error;
    }
  }

  async get(id) {
    try {
      const response = await this.model.findByPk(id);
      if (!response) {
        throw new AppError("Resource not found", StatusCodes.NOT_FOUND);
      }
      return response;
    } catch (error) {
      Logger.error("Error in get:", error);
      throw error;
    }
  }

  async getAll(filter = {}) {
    try {
      const response = await this.model.findAll(filter);
      return response;
    } catch (error) {
      Logger.error("Error in getAll:", error);
      throw new AppError("Failed to fetch resources", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id, data) {
    try {
      const [affectedCount] = await this.model.update(data, {
        where: { id }
      });
      if (!affectedCount) {
        throw new AppError("Resource not found", StatusCodes.NOT_FOUND);
      }
      // Fetch updated row
      const updated = await this.model.findByPk(id);
      return updated;
    } catch (error) {
      Logger.error("Error in update:", error);
      if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError" ||
      error.name === "SequelizeDatabaseError"
    ) {
      throw error;
    }
      throw new AppError("Failed to update resource", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = CrudRepository;
