const prisma = require("../../db");

// "/api/products/:productId/comments"  POST
async function postComment(req, res, next) {
  // Connect to author via userId
  const { userId } = req.userData;
  // Connect to product via productId
  const { productId } = req.params;
  const { content, rating } = req.body;
  // console.log("content", content); // test
  // console.log("rate", rating); // test
  // console.log("rate type", typeof rating); // test
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
      // console.log("product in question", product.comments); // test
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

        console.log("updatedRating", updatedRating); // test
        console.log("numberOfReviews", updatedComments.length); // test

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

// Use select  to return specific fields - you can also use a nested select to include relation fields
// Use include  to explicitly include relations

// await prisma.product.update({
//   where: {
//     id: productId,
//   },
//   data: {
//     name: name,
//     slug: slug + "-" + Math.random(), // Ensures slug remains unique
//     price: price,
//     image: image,
//     category: category,
//     brand: brand,
//     inStock: inStock,
//     description: description,
//   },
// });

module.exports = postComment;
