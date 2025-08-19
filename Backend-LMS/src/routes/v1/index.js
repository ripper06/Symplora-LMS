const express = require ('express');

const employeeRoutes = require('./employee-routes')
const authRoutes = require('./auth-routes')
const leaveRoutes = require('./leave-routes')

const { InfoController } = require('../../controllers')

const router = express.Router();

//info-controller
router.get('/info', InfoController.info);

router.use('/employees', employeeRoutes);
router.use('/auth', authRoutes);
router.use('/leaves', leaveRoutes);

module.exports = router;