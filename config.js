const CustomError = require("./helpers/customError");
require("dotenv").config();
const requiredEnvs= ["MONGO_URI", "JWT_SECRET"];
const missingEnvs= requiredEnvs.filter(env=> !process.env[env]);
if(missingEnvs.length) {
    throw new CustomError(`missing Envs ${missingEnvs.join(",")}`, 500);
}
module.exports = {
    saltRound: process.env.SALT_ROUND || 12,
    mongoUri: process.env.MONGO_URI,
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET
}