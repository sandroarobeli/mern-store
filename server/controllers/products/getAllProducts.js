const prisma = require("../../db");

async function getAllProducts(req, res, next) {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    return next(new Error(`Unable to retrieve products: ${error.message}`));
  }
}

module.exports = getAllProducts;
