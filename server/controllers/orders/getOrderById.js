const prisma = require("../../db");

async function getOrderById(req, res, next) {
  const { orderId } = req.params;
  const { userId } = req.userData;

  try {
    const existingOrder = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      // include: {
      //   // If needs to be included, make sure only name gets returned!!
      //   owner: true,
      // },
    });

    if (!existingOrder) {
      return next(new Error("Order could not be found"));
    }
    // If logged in user tries to look up someone else's order..
    // e.g. userId from userData from token does not match
    // order owner's id
    if (existingOrder.ownerId !== userId) {
      return next(new Error("You are not authorized to view this page"));
    }

    res.status(200).json(existingOrder);
  } catch (error) {
    return next(
      new Error(
        error ? error : "Failed to retrieve your order. Please try again later"
      )
    );
  }
}

module.exports = getOrderById;
