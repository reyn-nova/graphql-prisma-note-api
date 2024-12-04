import { prisma } from "../../helpers/prismaInstance";
import { checkAndGetSessionUser } from "../../helpers/user";

const meQuery = async (_: any, __: any, context: any) => {
    const user = checkAndGetSessionUser(context)

    return prisma.user.findUnique({ where: { id: user.id } });
}

export default meQuery;