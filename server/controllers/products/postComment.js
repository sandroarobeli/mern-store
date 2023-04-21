const prisma = require("../../db");

async function postComment(req, res, next) {
  const { userId } = req.userData;
  const { productId } = req.params;
  const { content, rating } = req.body;

  try {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
      },
    });

    if (!currentUser) {
      return next(new Error("Login required to leave a comment"));
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        comments: true,
      },
    });

    if (product) {
      const existingComment = product.comments.find(
        (comment) => comment.authorId === userId
      );

      if (existingComment) {
        // If the comment already exists, we update it
        const updatedComment = await prisma.comment.update({
          where: {
            id: existingComment.id,
          },
          data: {
            content: content,
            rating: rating,
          },
        });
        // Replace existing comment with updated comment, even if nothing changed
        const indexToReplace = product.comments.findIndex(
          (comment) => comment.id === existingComment.id
        );
        product.comments.splice(indexToReplace, 1, updatedComment);

        const updatedRating =
          product.comments.reduce((a, c) => a + c.rating, 0) /
          product.comments.length;
        // And we update properties of product based on existing Comment
        await prisma.product.update({
          where: {
            id: productId,
          },
          data: {
            // This number hasn't changed
            reviews: product.comments.length,
            // This one might have changed
            rating: updatedRating,
          },
        });

        res.end();
      } else {
        // Otherwise, since there is no comment, we create it
        const newComment = await prisma.comment.create({
          data: {
            content: content,
            rating: rating,
            authorName: currentUser.name,
            author: {
              connect: {
                id: userId,
              },
            },
            product: {
              connect: {
                id: productId,
              },
            },
          },
        });

        const updatedComments = [...product.comments, newComment];
        const updatedRating =
          updatedComments.reduce((a, c) => a + c.rating, 0) /
          updatedComments.length;

        // And we update properties of product based on new Comment
        await prisma.product.update({
          where: {
            id: productId,
          },
          data: {
            // This number did change
            reviews: updatedComments.length,
            // This number might have changed
            rating: updatedRating,
          },
        });
        res.end();
      }
    }
  } catch (error) {
    return next(new Error(`Failed to add you comment: ${error.message}`));
  }
}

module.exports = postComment;
