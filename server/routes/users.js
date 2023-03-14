const express = require("express");
const { check } = require("express-validator");

const login = require("../controllers/users/login");
const googleLogin = require("../controllers/users/googleLogin");
const register = require("../controllers/users/register");
const googleRegister = require("../controllers/users/googleRegister");

// Initializing the router object
const router = express.Router();

// Login a User with credentials (email, password)
router.post(
  "/login",
  [
    check("email").not().isEmpty().isEmail().trim().escape(),
    check("password").not().isEmpty().trim().escape(),
  ],
  login
);

// Login a User with Google Login
router.post("/google-login", googleLogin);

// Register a User with credentials (name, email, password)
router.post(
  "/register",
  [
    check("name").not().isEmpty().trim().escape(),
    check("email").not().isEmpty().isEmail().trim().escape(),
    check("password").not().isEmpty().trim().escape(),
  ],
  register
);

// Register a User with Google Register
router.post("/google-register", googleRegister);

module.exports = router;
