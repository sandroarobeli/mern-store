const express = require("express");
const { check } = require("express-validator");

const login = require("../controllers/users/login");
const googleLogin = require("../controllers/users/googleLogin");

// Initializing the router object
const router = express.Router();

// Login a User with credentials (email, password)
router.post(
  "/login",
  [
    check("email").not().isEmpty().trim().escape(),
    check("password").not().isEmpty().trim().escape(),
  ],
  login
);

// Login a User with Google Login
router.post("/google-login", googleLogin);

module.exports = router;
