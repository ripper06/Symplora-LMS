const express = require("express");

const {AuthController} = require('../../controllers')
const {AuthMiddlewares} = require('../../middlewares');
const { loginUser } = require("../../controllers/auth-controller");

const router = express.Router();

router.post('/login', 
    AuthMiddlewares.validateCredentials,
    AuthController.loginUser)

router.post('/change-password', 
    AuthMiddlewares.authenticateJWT,
    AuthController.changeUserPassword)



module.exports = router;