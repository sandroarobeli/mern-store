const prisma = require("../../db");

async function placeOrder(req, res, next) {
  // userData gets added to request object by authorization module
  const { userId } = req.userData;

  try {
    const newOrder = await prisma.order.create({
      data: {
        orderItems: req.body.orderItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
        })),
        shippingAddress: {
          fullName: req.body.shippingAddress.fullName,
          address: req.body.shippingAddress.address,
          city: req.body.shippingAddress.city,
          state: req.body.shippingAddress.state,
          zip: req.body.shippingAddress.zip,
          phone: req.body.shippingAddress.phone,
        },
        paymentMethod: req.body.paymentMethod,
        itemsTotal: req.body.itemsTotal,
        taxTotal: req.body.taxTotal,
        shippingTotal: req.body.shippingTotal,
        grandTotal: req.body.grandTotal,
        owner: {
          connect: {
            id: userId,
          },
        },
      },
    });

    // console.log("user including orders", getUser); // test
    res.status(201).json(newOrder);
  } catch (error) {
    console.log("error from controller", error); // test
    return next(
      new Error(
        error ? error : "Failed to process your order. Please try again later"
      )
    );
  }
}

module.exports = placeOrder;
