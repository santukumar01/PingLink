const jwt = require("jsonwebtoken");

const genrerateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRECT, {
    expiresIn: "1y",
  });
};

module.exports = genrerateToken;
