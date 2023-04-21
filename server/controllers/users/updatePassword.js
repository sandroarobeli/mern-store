const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const prisma = require("../../db");

async function updatePassword(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error("Invalid inputs entered. Please check your data"));
  }

  const { email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!existingUser?.email) {
      return next(
        new Error(
          "Email not found. Please enter email associated with this account."
        )
      );
    }
    // Check if existingUser.password matches hashed version of newly entered plaintext password
    let isNewSameAsOld = false;
    try {
      isNewSameAsOld = await bcrypt.compare(password, existingUser.password);
    } catch (error) {
      return next(
        new Error(`Update failed. Please try again later.\n${error.message}`)
      );
    }

    if (isNewSameAsOld) {
      return next(
        new Error("Your new password cannot be the same as the previous one")
      );
    }

    await prisma.user.update({
      where: { email: email },
      data: { password: bcrypt.hashSync(password) },
    });

    res.end();
  } catch (error) {
    return next(new Error(`Failed to update: ${error.message}`));
  }
}

module.exports = updatePassword;
