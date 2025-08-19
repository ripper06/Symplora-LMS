'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Employee, {
          foreignKey: 'employeeId',
          as: 'employee'  // a User belongs to an Employee
      });
    }
  }
  User.init( {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('EMPLOYEE', 'HR', 'ADMIN'),
        allowNull: false,
        defaultValue: 'EMPLOYEE',
      },
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Employees',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      isFirstLogin: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      }
    }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
  });
  return User;
};