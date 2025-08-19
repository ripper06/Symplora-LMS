const CrudRepository = require("./crud-repository");
const { LeaveRequest } = require("../models");
const { Op } = require("sequelize");

class LeaveRepository extends CrudRepository {
  constructor() {
    super(LeaveRequest);
  }

  /**
   * Get all leave requests for a specific employee
   * @param {number} employeeId
   * @param {object} filter optional { status: 'PENDING' }
   * @returns {Promise<LeaveRequest[]>}
   */

  async getByEmployee(employeeId, filter = {}) {
    const whereClause = { employeeId, ...filter };
    return this.model.findAll({
      where: whereClause,
      order: [["startDate", "DESC"]],
    });
  }

  /**
   * Check if the employee has overlapping leaves
   * @param {number} employeeId
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns {Promise<LeaveRequest[]>} overlapping leave requests
   */
  async getOverlappingLeaves(employeeId, startDate, endDate) {
    return this.model.findAll({
      where: {
        employeeId,
        status: "APPROVED",
        startDate: { [Op.lte]: endDate  },
        endDate: { [Op.gte]: startDate  },
      },
    });
  }
}

module.exports = LeaveRepository;
