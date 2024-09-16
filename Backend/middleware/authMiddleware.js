const jwt = require("jsonwebtoken");

function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    try {
      const token = req.cookies?.token;
      if (!token) {
        return reject("No token provided");
      }

      jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
        if (err) {
          return reject("Invalid token");
        }
        resolve(userData);
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = getUserDataFromRequest;
