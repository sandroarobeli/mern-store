const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const prisma = require("../../db");
const convertDocumentToObject = require("../../utils/docToObject");

async function login(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error("Invalid inputs entered. Please check your data"));
  }

  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!existingUser) {
      return next(
        new Error(
          "User not found. Please enter a valid email or proceed to signup."
        )
      );
    }
    // Check if existingUser.password matches hashed version of newly entered plaintext password
    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (error) {
      return next(
        new Error(`Login failed. Please try again later.\n${error.message}`)
      );
    }
    // Catch block right above deals with connection etc. type errors
    // isValidPassword = false is a valid result and gets addressed below
    if (!isValidPassword) {
      return next(
        new Error(
          "Invalid credentials entered. Please check your credentials and try again"
        )
      );
    }

    let token;
    try {
      token = jwt.sign(
        { userId: existingUser.id },
        process.env.SECRET_TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
    } catch (error) {
      return next(new Error("Login failed. Please try again"));
    }

    res.status(200).json({
      ...convertDocumentToObject(existingUser),
      image: "NA",
      token: token,
      // Sets time to 2 Hours for THIS application
      expiration: new Date().getTime() + 1000 * 60 * 60 * 2,
    });
  } catch (error) {
    return next(new Error(`Login failed: ${error.message}`));
  }
}

module.exports = login;
