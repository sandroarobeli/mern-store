// CREATES EMAIL-TOKEN AND SENDS IT TO generateResetLink ALONG WITH USER'S EMAIL.
// generateResetLink GENERATES A TIME SENSITIVE LINK THAT INCLUDES TOKEN AS A
// REQUEST PARAMETER AND EMAILS THAT LINK TO THE USER'S INBOX.
// LINK TRIGGERS THE ROUTE THAT USES EMAIL TOKEN VALIDATOR AS A CONTROLLER FUNCTION.
// VALIDATOR VERIFIES THE TOKEN AND IF IT'S STILL VALID REDIRECTS TO APPROPRIATE (PASSWORD RESET)
// PAGE. OTHERWISE, IT REDIRECTS TO LINK EXPIRED PAGE AS A FEEDBACK

const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const prisma = require("../../db");
const generateResetLink = require("../../utils/generateResetLink");

async function resetEmail(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new Error("Email is missing or invalid. Please provide valid email.")
    );
  }

  const { email } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!existingUser) {
      return next(
        new Error(
          "Email not found. Please enter a valid email or proceed to signup."
        )
      );
    }

    let emailToken;
    try {
      emailToken = jwt.sign(
        { userEmail: email },
        process.env.SECRET_TOKEN_KEY,
        {
          expiresIn: "15m",
        }
      );
    } catch (error) {
      return next(new Error("Processing error. Please try again later."));
    }

    // Invoke email generating function with user email & unique token
    await generateResetLink(email, emailToken);

    res.end();
  } catch (error) {
    return next(
      new Error(`Password reset currently unavailable: ${error.message}`)
    );
  }
}

module.exports = resetEmail;
