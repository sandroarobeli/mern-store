const jwt = require("jsonwebtoken");
require("dotenv").config();

// This middleware function checks if we have a token and if so,
// Whether it's valid or not
function checkAuthorization(req, res, next) {
  if (req.method === "OPTIONS") {
    // Just an extra precaution: OPTIONS request inquires which request methods a server supports
    // such as "GET", "PATCH" etc.
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Format -> authorization: 'Bearer TOKEN'

    if (!token) {
      // redundancy measure. catch below does it too
      throw new Error("Authorization required. Please log in or sign up.");
    }
    // There IS a token object, we validate it: verify returns an object, not boolean
    // If this fails to verify, it goes directly to catch block below
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    // decodedToken has all the props we assigned, when created it. Namely: userId & password
    req.userData = { userId: decodedToken.userId }; // Adding new property on the fly
    // calling next() without an error allows request to continue it's journey!
    next();
  } catch (error) {
    return next(
      new Error(
        error?.message || "Authorization required. Please log in or sign up."
      )
    );
  }
}

module.exports = checkAuthorization;
