const express = require("express");
const { check } = require("express-validator");

const checkAuthorization = require("../utils/checkAuthorization");
const summary = require("../controllers/admin/summary");
const getUsersList = require("../controllers/admin/usersList");
const getOrdersList = require("../controllers/admin/ordersList");
const updateProduct = require("../controllers/admin/updateProduct");
const createProduct = require("../controllers/admin/createProduct");
const deleteProduct = require("../controllers/admin/deleteProduct");
const deleteUser = require("../controllers/admin/deleteUser");
const updateUser = require("../controllers/admin/updateUser");
const updateDeliveredStatus = require("../controllers/admin/updateDeliveredStatus");
const signature = require("../controllers/admin/cloudinarySign");

// Initializing the router object
const router = express.Router();

// Retrieve sales summary. Privileged, requires authorization as Admin
router.get("/summary", checkAuthorization, summary);

// Retrieve complete orders list. Privileged, requires authorization as Admin
router.get("/orders", checkAuthorization, getOrdersList);

// Retrieve complete Users list. Privileged, requires authorization as Admin
router.get("/users", checkAuthorization, getUsersList);

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

// Update user. Privileged, requires authorization as Admin
router.patch("/user/:updatedUserId", checkAuthorization, updateUser);

// Create product. Privileged, requires authorization as Admin
router.post(
  "/product",
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
  createProduct
);

// Delete product. Privileged, requires authorization as Admin
router.delete("/product/:productId", checkAuthorization, deleteProduct);

// Delete user. Privileged, requires authorization as Admin
router.delete("/user/:deletedUserId", checkAuthorization, deleteUser);

// Update order delivery status. Privileged, requires authorization as Admin
router.patch("/order/:orderId", checkAuthorization, updateDeliveredStatus);

// Gain authorization from Cloudinary by receiving signature and timestamp credentials
router.get("/cloudinary-sign", checkAuthorization, signature);

module.exports = router;
