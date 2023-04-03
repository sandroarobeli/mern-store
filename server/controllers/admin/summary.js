const prisma = require("../../db");

async function summary(req, res, next) {
  const { userId } = req.userData;

  try {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        isAdmin: true,
      },
    });

    if (!currentUser || !currentUser.isAdmin) {
      return next(new Error("Access denied. Admin privileges required."));
    }

    const ordersCount = await prisma.order.count();
    const productsCount = await prisma.product.count();
    const usersCount = await prisma.user.count();
    // Need to add totals on monthly (date related) basis
    // Prisma Client does not yet support This feature, so I use
    // Raw database access to bypass this limitation
    const orders = await prisma.order.aggregateRaw({
      pipeline: [
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%m-%Y",
                date: "$createdAt",
              },
            },
            itemsTotal: { $sum: "$itemsTotal" },
          },
        },
      ],
    });
    // console.log("sorted data", orders); // test
    const summary = {
      productsCount,
      usersCount,
      ordersCount,
      ordersTotal: orders.reduce((a, c) => a + c.itemsTotal, 0),
      chartingData: orders,
    };

    res.status(200).json(summary);
  } catch (error) {
    return next(new Error(`Failed to load the summary: ${error.message}`));
  }
}

module.exports = summary;
