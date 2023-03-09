const express = require("express");

const placeOrder = require("../controllers/orders/placeOrder");
const getOrderById = require("../controllers/orders/getOrderById");
const checkAuthorization = require("../utils/checkAuthorization");

// Initializing the router object
const router = express.Router();

// place order. Privileged, requires authorization
router.post("/place-order", checkAuthorization, placeOrder);

// Retrieve an order by its id. Privileged, requires authorization
router.get("/:orderId", checkAuthorization, getOrderById);

// NOTE: WHEN RETRIEVING ALL THE ORDERS BY A USER, GET IT SENT VIA PRISMA.USER
// AS OPPOSED TO PRISMA.ORDER
module.exports = router;
