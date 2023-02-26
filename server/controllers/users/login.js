const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const prisma = require("../../db");
const convertDocumentToObject = require("../../utils/docToObject");

async function login(req, res, next) {
  // Middleware registered in the routes gets invoked here
  // If returned errors object isn't empty, error is passed down the chain via next()
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error("Invalid inputs entered. Please check your data")); // 422
  }

  const { email, password } = req.body;

  try {
    // Checking if email already exists
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
    // After we ensure user(its email) exists, and the passwords match,
    // We can generate the Token
    // This way, frontend will attach this token to the requests going to routes that
    // REQUIRE AUTHORIZATION
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
    // Sending back whatever data we want with created token
    // res.status(201).json(createdUser)
    res.status(200).json({
      ...convertDocumentToObject(existingUser),
      image: "NA",
      token: token,
      // Sets time to 15 Seconds for TESTING
      // expiration: new Date().getTime() + 1000 * 15
      // Sets time to 2 Hours for THIS application
      expiration: new Date().getTime() + 1000 * 60 * 60 * 2,
    });
  } catch (error) {
    return next(new Error(`Login failed: ${error.message}`));
  }
}

module.exports = login;
