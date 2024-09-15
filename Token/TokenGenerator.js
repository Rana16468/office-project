const jwt = require("jsonwebtoken");

const createToken = (payload, expiresIn) => {
  const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    algorithm: "HS256",
    expiresIn,
  });
  return token;
};
const varifyToken = (token, varifyed_token) => {
  return jwt.verify(token, varifyed_token);
};

module.exports = {
  createToken,
  varifyToken,
};
