const express = require("express");
const { check } = require("express-validator");

const checkAuthorization = require("../utils/checkAuthorization");
const summary = require("../controllers/admin/summary");
const getOrdersList = require("../controllers/admin/ordersList");
const updateProduct = require("../controllers/admin/updateProduct");
const updateDeliveredStatus = require("../controllers/admin/updateDeliveredStatus");

// Initializing the router object
const router = express.Router();

// Retrieve sales summary. Privileged, requires authorization
router.get("/summary", checkAuthorization, summary);

// Retrieve complete orders list. Privileged, requires authorization
router.get("/orders", checkAuthorization, getOrdersList);

// Update product. Privileged, requires authorization as Admin
router.patch(
  "/product/:productId",
  [
    check("name").not().isEmpty().trim().escape(),
    check("slug").not().isEmpty().trim().escape(),
    check("price").isFloat(),
    check("image").not().isEmpty(), //   .trim().escape(), // escape Destroys the path!
    check("category").not().isEmpty().trim().escape(),
    check("brand").not().isEmpty().trim().escape(),
    check("inStock").isInt(),
    check("description").not().isEmpty().trim().escape(),
  ],
  checkAuthorization,
  updateProduct
);

// Update order delivery status. Privileged, requires authorization as Admin
router.patch("/order/:orderId", checkAuthorization, updateDeliveredStatus);

module.exports = router;
