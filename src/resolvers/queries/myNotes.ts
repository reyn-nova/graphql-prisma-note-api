import { prisma } from "../../helpers/prismaInstance";
import { checkAndGetSessionUser } from "../../helpers/user";

const myNotesQuery = (_: any, __: any, context: any) => {
    const user = checkAndGetSessionUser(context)

    return prisma.note.findMany({ where: { ownerId: user.id } });
}
  
export default myNotesQuery;