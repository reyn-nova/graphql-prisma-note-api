import { prisma } from "../helpers/prismaInstance";

import mutations from "./mutations";
import queries from "./queries";

const resolvers = {
    Query: queries,
    Mutation: mutations,
    Note: {
      owner: (note: any) =>
        prisma.user.findUnique({ where: { id: note.ownerId } }),
      seenBy: (note: any) =>
        prisma.user.findMany({ where: { seenNotes: { some: { id: note.id } } } }),
      likedBy: (note: any) =>
        prisma.user.findMany({ where: { likedNotes: { some: { id: note.id } } } }),
    },
};

export default resolvers;
