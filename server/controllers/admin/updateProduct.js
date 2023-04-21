const { validationResult } = require("express-validator");

const prisma = require("../../db");

async function updateProduct(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error("Invalid inputs entered. Please check your data"));
  }

  const { userId } = req.userData;
  const { productId } = req.params;
  const { name, slug, price, image, category, brand, inStock, description } =
    req.body;

  try {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        isAdmin: true,
      },
    });
    // Ensures logged in user has Admin privileges
    if (!currentUser || !currentUser.isAdmin) {
      return next(
        new Error(
          "You are not authorized to perform this function. Admin privileges required"
        )
      );
    }
    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name: name,
        slug: slug + "-" + Math.random(),
        price: price,
        image: image,
        category: category,
        brand: brand,
        inStock: inStock,
        description: description,
      },
    });

    res.end();
  } catch (error) {
    return next(new Error(`Failed to update: ${error.message}`));
  }
}

module.exports = updateProduct;
