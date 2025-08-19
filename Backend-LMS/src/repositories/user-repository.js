const CrudRepository = require('./crud-repository');
const { User } = require('../models');

class UserRepository extends CrudRepository {
  constructor() {
    super(User);
  }

async getByEmail(email) {
  try {
    const user = await this.model.findOne({ where: { email } });
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }
    return user;
  } catch (error) {
    Logger.error("Error in getByEmail:", error);
    throw error;
  }
}
}

module.exports = UserRepository;
