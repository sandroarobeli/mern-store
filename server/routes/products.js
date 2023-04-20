const express = require("express");

const checkAuthorization = require("../utils/checkAuthorization");
const getAllProducts = require("../controllers/products/getAllProducts");
const searchProducts = require("../controllers/products/searchProducts");
const filterProperties = require("../controllers/products/filterProperties");
const getComments = require("../controllers/products/getComments");
const postComment = require("../controllers/products/postComment");

// Initializing the router object
const router = express.Router();

// List all current products
router.get("/", getAllProducts);

// Retrieve products based on search parameters
router.post("/search", searchProducts);

// Returns de-duped properties of all products
router.get("/filter", filterProperties);

// Retrieves comments for a specific product
router.get("/:productId/comments", getComments);

// Adds comments and rating to a specific product. Privileged, requires authorization
router.post("/:productId/comments", checkAuthorization, postComment);

module.exports = router;
