const express = require("express");

const getAllProducts = require("../controllers/products/getAllProducts");

// Initializing the router object
const router = express.Router();

// List all current products
router.get("/", getAllProducts);

module.exports = router;
