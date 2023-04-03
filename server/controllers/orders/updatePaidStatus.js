const prisma = require("../../db");

async function updatePaidStatus(req, res, next) {
  const { orderId } = req.params;

  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!existingOrder) {
      return next(new Error("Order could not be found"));
    }
    if (existingOrder.isPaid) {
      return next(new Error("Order is already paid!"));
    }
    await prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult: {
          paypalId: req.body.id,
          status: req.body.status,
          email_address: req.body.payer.email_address,
        },
      },
    });

    res.end();
  } catch (error) {
    return next(new Error(error ? error : "Failed to update order status."));
  }
}

module.exports = updatePaidStatus;
