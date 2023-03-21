const prisma = require("../../db");

async function getOrderHistory(req, res, next) {
  const { userId } = req.params;

  try {
    const orders = await prisma.order.findMany({
      where: {
        ownerId: userId,
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    return next(
      new Error(
        `An error ocurred while loading your order history: ${error.message}`
      )
    );
  }
}

module.exports = getOrderHistory;
