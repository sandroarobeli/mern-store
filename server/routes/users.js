const express = require("express");
const { check } = require("express-validator");

const checkAuthorization = require("../utils/checkAuthorization");
const login = require("../controllers/users/login");
const googleLogin = require("../controllers/users/googleLogin");
const register = require("../controllers/users/register");
const googleRegister = require("../controllers/users/googleRegister");
const resetEmail = require("../controllers/users/resetEmail");
const passwordResetLinkValidate = require("../controllers/users/passwordResetLinkValidate");
const updatePassword = require("../controllers/users/updatePassword");
const updateProfile = require("../controllers/users/updateProfile");

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

// Generate an email with the link to reset User password
router.post(
  "/reset-email",
  check("email").not().isEmpty().isEmail().trim().escape(),
  resetEmail
);

// Validate time sensitive link to password reset page
router.get(
  "/password-reset-link-validate/:emailToken",
  passwordResetLinkValidate
);

// Update User password
router.patch(
  "/update-password",
  check("email").not().isEmpty().isEmail().trim().escape(),
  check("password").not().isEmpty().trim().escape(),
  updatePassword
);

// Update User profile. Privileged, requires authorization
router.patch(
  "/update-profile",
  [
    check("name").not().isEmpty().trim().escape(),
    check("email").not().isEmpty().isEmail().trim().escape(),
    check("password").not().isEmpty().trim().escape(),
  ],
  checkAuthorization,
  updateProfile
);

module.exports = router;
