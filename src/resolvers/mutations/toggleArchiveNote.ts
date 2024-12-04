import { prisma } from "../../helpers/prismaInstance";
import { checkAndGetSessionUser } from "../../helpers/user";

const toggleArchiveNoteMutation = async (_: any, args: { noteId: number }, context: any) => {
    const user = checkAndGetSessionUser(context)

    const { noteId } = args;
    
    const note = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note || note.ownerId !== user.id) {
      throw new Error("You do not have permission to toggle archive status for this note.");
    }

    // Toggle the archivedAt field
    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: {
        archivedAt: note.archivedAt ? null : new Date().toISOString(),
      },
      include: {
        likedBy: true,
        seenBy: true,
        owner: true,
      },
    });

    return updatedNote;
}

export default toggleArchiveNoteMutation;
