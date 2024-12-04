import { prisma } from "../../helpers/prismaInstance";
import { checkAndGetSessionUser } from "../../helpers/user";

const toggleLikeNoteMutation = async (_: any, args: { noteId: number }, context: any) => {
    const user = checkAndGetSessionUser(context)

    const userId = user.id;

    const { noteId } = args;

    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: { likedBy: true },
    });

    if (!note) {
      throw new Error("Note not found.");
    }

    const isLiked = note.likedBy.some((item) => item.id === userId);

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: {
        likedBy: isLiked
          ? { disconnect: { id: userId } }
          : { connect: { id: userId } },
      },
      include: {
        likedBy: true,
        seenBy: true,
        owner: true,
      },
    });

    return updatedNote;
}

export default toggleLikeNoteMutation;
