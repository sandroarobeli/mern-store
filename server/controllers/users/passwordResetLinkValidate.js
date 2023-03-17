const jwt = require("jsonwebtoken");
require("dotenv").config();

async function passwordResetLinkValidate(req, res, next) {
  try {
    const { emailToken } = req.params;
    // No token for some reason
    if (!emailToken) {
      return next(
        new Error("This link is invalid. Please submit your email again.")
      );
    }
    // Verify the token is not expired
    jwt.verify(emailToken, process.env.SECRET_TOKEN_KEY, (error, decoded) => {
      if (error) {
        res.redirect(`${process.env.CLIENT_DOMAIN}/expired-password-link`);
      } else {
        res.redirect(`${process.env.CLIENT_DOMAIN}/password-reset-form`);
      }
    });
  } catch (error) {
    return next(
      new Error(`Invalid link. Please try again later: ${error.message}`)
    ); // 500
  }
}

module.exports = passwordResetLinkValidate;
