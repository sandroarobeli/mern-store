const express = require("express");

const checkAuthorization = require("../utils/checkAuthorization");
const summary = require("../controllers/admin/summary");
const getOrdersList = require("../controllers/admin/ordersList");

// Initializing the router object
const router = express.Router();

// Retrieve sales summary. Privileged, requires authorization
router.get("/summary", checkAuthorization, summary);

// Retrieve complete orders list. Privileged, requires authorization
router.get("/orders", checkAuthorization, getOrdersList);

module.exports = router;
