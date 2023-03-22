const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const prisma = require("../../db");
const convertDocumentToObject = require("../../utils/docToObject");

async function register(req, res, next) {
  // Middleware registered in the routes gets invoked here
  // If returned errors object isn't empty, error is passed down the chain via next()
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error("Invalid inputs entered. Please check your data")); // 422
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingUser) {
      return next(new Error("The User already exists."));
    }

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: bcrypt.hashSync(password),
      },
    });

    let token;
    try {
      token = jwt.sign({ userId: newUser.id }, process.env.SECRET_TOKEN_KEY, {
        expiresIn: "2h",
      });
    } catch (error) {
      return next(new Error("Registration failed. Please try again"));
    }

    res.status(201).json({
      ...convertDocumentToObject(newUser),
      image: "NA",
      token: token,
      // Sets time to 15 Seconds for TESTING
      // expiration: new Date().getTime() + 1000 * 15
      // Sets time to 2 Hours for THIS application
      expiration: new Date().getTime() + 1000 * 60 * 60 * 2,
    });
  } catch (error) {
    return next(new Error(`Registration failed: ${error.message}`));
  }
}

module.exports = register;
