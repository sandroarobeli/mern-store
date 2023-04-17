const express = require("express");

const getAllProducts = require("../controllers/products/getAllProducts");
const searchProducts = require("../controllers/products/searchProducts");
const filterProperties = require("../controllers/products/filterProperties");

// Initializing the router object
const router = express.Router();

// List all current products
router.get("/", getAllProducts);

// Retrieve products based on search parameters
router.post("/search", searchProducts);

// Returns de-duped properties of all products
router.get("/filter", filterProperties);

module.exports = router;
