const prisma = require("../../db");

async function getAllProducts(req, res, next) {
  try {
    const products = await prisma.product.findMany({
      // Shows newest products first
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(products);
  } catch (error) {
    return next(new Error(`Failed to retrieve products: ${error.message}`));
  }
}

module.exports = getAllProducts;
