const prisma = require("../../db");

// "/api/products/:productId/comments"  GET
async function getComments(req, res, next) {
  const { productId } = req.params;
  // HAVE TO USE THIS SEPARATE MODULE. GET ALL PRODUCTS WILL INCLUDE ALL THE COMMENTS FROM
  // ALL THE PRODUCTS AND BESIDES BEING SUPER HEAVY, IT'LL POSE A CHALLENGE ON FINDING THE
  // APPROPRIATE COMMENT
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        comments: true,
      },
    });
    if (product) {
      res.status(200).json(product.comments);
    } else {
      return next(new Error("Product not found"));
    }
  } catch (error) {
    return next(new Error(`Failed to retrieve comments: ${error.message}`));
  }
}

module.exports = getComments;
