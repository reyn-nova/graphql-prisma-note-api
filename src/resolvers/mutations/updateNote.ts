import { prisma } from "../../helpers/prismaInstance";
import { checkAndGetSessionUser } from "../../helpers/user";

const updateNoteMutation = async (
  _: any,
  args: { noteId: number; title?: string; value?: string },
  context: any
) => {
  const user = checkAndGetSessionUser(context)

  const userId = user.id;

  const { noteId, title, value } = args;

  const note = await prisma.note.findUnique({
    where: { id: noteId },
    select: { ownerId: true },
  });

  if (!note) {
    throw new Error("Note not found.");
  }

  if (note.ownerId !== userId) {
    throw new Error("You can only update your own notes.");
  }

  const updatedNote = await prisma.note.update({
    where: { id: noteId },
    data: {
      title: title ?? undefined,
      value: value ?? undefined,
    },
  });

  return updatedNote;
}

export default updateNoteMutation;
