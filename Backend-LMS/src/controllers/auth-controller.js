const {AuthService} = require('../services')
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const {SuccessResponse,ErrorResponse} = require('../utils/common')

const {login,changePassword} =  AuthService;

async function loginUser(req, res, next) {
    try {
        const result = await login(req.body);
        SuccessResponse.data = result;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res
    .status(error.statusCode || 500)
    .json(ErrorResponse);
  }
}

async function changeUserPassword(req,res,next) {
    try{
    const userId = req.user.userId
    const { oldPassword, newPassword } = req.body;
    const result = await changePassword(userId, oldPassword, newPassword);
    SuccessResponse.data = result;
    return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res
    .status(error.statusCode || 500)
    .json(ErrorResponse);
  }

}

module.exports = {
    loginUser,
    changeUserPassword
}