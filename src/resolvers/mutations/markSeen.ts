import { prisma } from "../../helpers/prismaInstance";
import { checkAndGetSessionUser } from "../../helpers/user";

const markSeenMutation = async (_: any, { noteId }: any, context: any) => {
    const user = checkAndGetSessionUser(context)

    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note) throw new Error("Note not found");

    return prisma.note.update({
      where: { id: noteId },
      data: { seenBy: { connect: { id: user.id } } },
      include: { seenBy: true },
    });
}

export default markSeenMutation;
