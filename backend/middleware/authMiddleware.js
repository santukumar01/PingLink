const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const response = require("../utils/reponsHandler");

const authMiddleware = (req, res, next) => {
  const authToken = req.cookies?.auth_token;

  if (!authToken) {
    return response(res, 401, "authorization token missing");
  }
  try {
    const decode = jwt.verify(authToken, process.env.JWT_SECRET);
    req.user = decode;
    console.log(req.user);
    next();
  } catch (error) {
    console.eror(error);
    return response(res, 401, "invalid or expired token");
  }
};
//2.23
