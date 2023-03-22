const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const prisma = require("../../db");

async function deleteAccount(req, res, next) {
  // Middleware registered in the routes gets invoked here
  // If returned errors object isn't empty, error is passed down the chain via next()
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error("Invalid inputs entered. Please check your data")); // 422
  }

  const { userId } = req.params;
  // const { userId } = req.userData;
  const { email } = req.body;
  try {
    const loggedInUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (loggedInUser.email !== email) {
      return next(
        new Error(
          "You are not authorized to delete this account. Please enter a valid email and try again."
        )
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });
    res.end();
  } catch (error) {
    return next(new Error(`Deletion failed: ${error.message}`));
  }
}

module.exports = deleteAccount;
