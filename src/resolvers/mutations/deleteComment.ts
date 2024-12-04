import { prisma } from "../../helpers/prismaInstance";
import { checkAndGetSessionUser } from "../../helpers/user";

const deleteCommentMutation = async (_: any, args: { commentId: number }, context: any) => {
  const user = checkAndGetSessionUser(context);

  const userId = user.id;

  const { commentId } = args;

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      author: true,
      note: {
        include: { owner: true },
      },
    },
  });

  if (!comment) {
    throw new Error("Comment not found.");
  }

  if (comment.note.archivedAt) {
    throw new Error("Cannot delete a comment on an archived note.");
  }

  if (comment.authorId !== userId && comment.note.ownerId !== userId) {
    throw new Error("You can only delete your own comments or comments on your note.");
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  return true;
}

export default deleteCommentMutation;
