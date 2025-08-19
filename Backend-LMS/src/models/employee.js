'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     Employee.hasOne(models.User, {
        foreignKey: 'employeeId',
        as: 'user'   // an Employee has one User account
      });
    }
  }

  Employee.init({
    name: {
      type : DataTypes.STRING,
      allowNull : false
    },
    email: {
      type : DataTypes.STRING,
      allowNull : false,
      unique : true,
      validate: { isEmail: true }
    },
    emp_id: {
      type : DataTypes.STRING,
      allowNull : false,
      unique : true
    },
    department:{
      type : DataTypes.STRING,
      allowNull : false, 
    },
    joiningDate:{
      type : DataTypes.DATE,
      allowNull : false,
    },
    leaveBalance: {
      type : DataTypes.INTEGER,
      allowNull : false,
      defaultValue: 44
    },
    lastTakenLeaveDate: {
      type : DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Employee',
    tableName: 'Employees'
  });
  return Employee;
};