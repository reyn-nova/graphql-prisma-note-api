import { prisma } from "../../helpers/prismaInstance";
import { checkAndGetSessionUser } from "../../helpers/user";

const createNoteMutation = async (_: any, { title, value }: any, context: any) => {
    const user = checkAndGetSessionUser(context)

    return prisma.note.create({
      data: {
        title,
        value,
        owner: { connect: { id: user.id } },
      },
    });
}

export default createNoteMutation;
