const prisma = require("../../db");

async function getComments(req, res, next) {
  const { productId } = req.params;

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
