const express = require("express");

const checkAuthorization = require("../utils/checkAuthorization");
const summary = require("../controllers/admin/summary");

// Initializing the router object
const router = express.Router();

// Retrieve sales summary
router.get("/summary", checkAuthorization, summary);

module.exports = router;
