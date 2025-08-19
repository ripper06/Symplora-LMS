const dotenv = require('dotenv');//calls an object

dotenv.config();

module.exports = {
    PORT : process.env.PORT,
    EMAIL_USER : process.env.EMAIL_USER,
    EMAIL_PASS : process.env.EMAIL_PASS,
    BCRYPT_SALT_ROUNDS : process.env.BCRYPT_SALT_ROUNDS,
    JWT_SECRET : process.env.JWT_SECRET,
    JWT_EXPIRES : process.env.JWT_EXPIRES,
}
