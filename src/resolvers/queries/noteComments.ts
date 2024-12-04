import { prisma } from "../../helpers/prismaInstance";

const noteCommentsQuery = async (_: any, args: { noteId: number }) => {
    const { noteId } = args;

    // Fetch comments for the note
    const comments = await prisma.comment.findMany({
      where: { noteId },
      include: {
        author: true,
        note: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return comments;
}
  
export default noteCommentsQuery;