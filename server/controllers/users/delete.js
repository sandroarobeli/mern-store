const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const prisma = require("../../db");

async function deleteAccount(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error("Invalid inputs entered. Please check your data"));
  }

  const { userId } = req.params;
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
    return next(new Error(`Failed to delete: ${error.message}`));
  }
}

module.exports = deleteAccount;
