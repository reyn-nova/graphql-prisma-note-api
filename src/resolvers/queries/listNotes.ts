import { prisma } from "../../helpers/prismaInstance";

const listNotesQuery = async (_: any, args: any) => {
    const { ownerId } = args;

    const where: any = {
      archivedAt: null,
    };

    if (ownerId) {
      where.id = ownerId;
    }

    return prisma.note.findMany({
      where,
      include: {
        owner: true,
        seenBy: true,
        likedBy: true,
        comments: {
            include: {
                author: true
            }
        },
      },
    });
}
  
export default listNotesQuery;