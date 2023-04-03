const prisma = require("../../db");

async function getOrderHistory(req, res, next) {
  const { userId } = req.params;

  try {
    // If logged in user tries to check history of someone else
    if (userId !== req.userData.userId) {
      return next(new Error("You are not authorized to access this data!"));
    }

    const orders = await prisma.order.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    return next(
      new Error(`Failed to load your order history: ${error.message}`)
    );
  }
}

module.exports = getOrderHistory;
