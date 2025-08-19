'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LeaveRequest extends Model {
    
    static associate(models) {
      // Each leave request belongs to one employee
      LeaveRequest.belongsTo(models.Employee, {
        foreignKey: 'employeeId',
        as: 'employee',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

    }
  }
  LeaveRequest.init({
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Employees',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
     }, {
    sequelize,
    modelName: 'LeaveRequest',
  });
  return LeaveRequest;
};