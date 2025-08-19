const CrudRepository = require('./crud-repository')
const {Employee} = require('../models')

class EmployeeRepository extends CrudRepository{
    constructor(){
        super(Employee);
    }
}

module.exports = EmployeeRepository;