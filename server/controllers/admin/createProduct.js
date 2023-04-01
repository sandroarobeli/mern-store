const { validationResult } = require("express-validator");

const prisma = require("../../db");

async function createProduct(req, res, next) {
  // Middleware registered in the routes gets invoked here
  // If returned errors object isn't empty, error is passed down the chain via next()
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error("Invalid inputs entered. Please check your data")); // 422
  }

  const { userId } = req.userData;
  const { name, slug, category, image, price, brand, inStock, description } =
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
    await prisma.product.create({
      data: {
        name,
        slug,
        category,
        image,
        price,
        brand,
        inStock,
        description,
      },
    });

    res.end();
  } catch (error) {
    return next(new Error(`Product creation failed: ${error.message}`));
  }
}

module.exports = createProduct;