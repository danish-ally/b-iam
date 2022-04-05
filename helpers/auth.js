const jwt = require("jsonwebtoken");

const checkAuth = async (req, next) => {
  try {
    if (!req.headers.authorization) {
      return null;
    }

    const token =
      (await jwt.decode(req.headers.authorization.split(" ")[1])) ||
      req.headers.authorization;
      checkAuth
    if (!token) {
      return null;
    }

    console.log(token);
    return token;
  } catch (error) {
    return null;
  }
};

module.exports = checkAuth;
