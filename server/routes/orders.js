const express = require("express");

const checkAuthorization = require("../utils/checkAuthorization");
const placeOrder = require("../controllers/orders/placeOrder");
const getOrderById = require("../controllers/orders/getOrderById");
const getOrderHistory = require("../controllers/orders/getOrderHistory");
const updatePaidStatus = require("../controllers/orders/updatePaidStatus");

// Initializing the router object
const router = express.Router();

// place order. Privileged, requires authorization
router.post("/place-order", checkAuthorization, placeOrder);

// Retrieve an order by its id. Privileged, requires authorization
router.get("/:orderId", checkAuthorization, getOrderById);

// Update order paid status. Privileged, requires authorization
router.patch("/:orderId/pay", checkAuthorization, updatePaidStatus);

// Retrieve order list belonging to a logged in user
router.get("/:userId/history", checkAuthorization, getOrderHistory);

module.exports = router;
