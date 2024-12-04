import { prisma } from "../../helpers/prismaInstance";
import { checkAndGetSessionUser } from "../../helpers/user";

const addCommentMutation = async (_: any, args: { noteId: number; content: string }, context: any) => {
  const user = checkAndGetSessionUser(context)

  const userId = user.id;

  const { noteId, content } = args;

  const note = await prisma.note.findUnique({ where: { id: noteId } });
  
  if (!note) {
    throw new Error("Note not found.");
  }

  if (note.archivedAt) {
    throw new Error("Cannot comment on an archived note.");
  }

  // Create the comment
  const comment = await prisma.comment.create({
    data: {
      content,
      noteId,
      authorId: userId,
    },
    include: {
      author: true,
      note: true,
    },
  });

  return comment;
}

export default addCommentMutation;
