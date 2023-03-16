const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const signJwt = promisify(jwt.sign);
const verifyJwt = promisify(jwt.verify);
const jwtSecret = "mySecret";
// const { jwtSecret } = require("../config"); 
const User = require("../models/user");
// console.log(jwtSecret);
module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log(req.headers.authorization);
    if (!token) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      return next(error);
    }
    const { id } = await verifyJwt(token, jwtSecret);
    const user = await User.findById(id);
    if (!user) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      return next(error);
    }
    req.user = user;
    next();
  } catch (err) {
    return next(err);
  }
};
