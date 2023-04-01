const prisma = require("../../db");

async function deleteProduct(req, res, next) {
  const { userId } = req.userData;
  const { productId } = req.params;

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

    await prisma.product.delete({
      where: { id: productId },
    });

    res.end();
  } catch (error) {
    return next(new Error(`Delete failed: ${error.message}`));
  }
}

module.exports = deleteProduct;
