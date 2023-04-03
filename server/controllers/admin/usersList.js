const prisma = require("../../db");

async function getUsersList(req, res, next) {
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
    // Ensures logged in user has Admin privileges
    if (!currentUser || !currentUser.isAdmin) {
      return next(
        new Error(
          "You are not authorized to perform this function. Admin privileges required"
        )
      );
    }

    const users = await prisma.user.findMany({
      // Shows newest products first
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(users);
  } catch (error) {
    return next(new Error(`Failed to retrieve users: ${error.message}`));
  }
}

module.exports = getUsersList;
