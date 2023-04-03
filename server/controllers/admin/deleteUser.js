const prisma = require("../../db");

async function deleteUser(req, res, next) {
  const { userId } = req.userData;
  const { deletedUserId } = req.params;

  try {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        isAdmin: true,
      },
    });
    const deletedUser = await prisma.user.findUnique({
      where: {
        id: deletedUserId,
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
    // Ensures Admin user cannot be deleted
    if (deletedUser.isAdmin) {
      return next(new Error("Deleting Admin is not permitted!"));
    }

    await prisma.user.delete({
      where: { id: deletedUserId },
    });

    res.end();
  } catch (error) {
    return next(new Error(`Failed to delete user: ${error.message}`));
  }
}

module.exports = deleteUser;
