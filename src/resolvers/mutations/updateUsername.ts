import { prisma } from "../../helpers/prismaInstance";
import { checkAndGetSessionUser } from "../../helpers/user";

const updateUsernameMutation = async (
  _: any,
  args: { newUsername: string },
  context: any
) => {
  const user = checkAndGetSessionUser(context);
  const userId = user.id;

  const { newUsername } = args;

  const existingUser = await prisma.user.findUnique({
    where: { username: newUsername },
  });

  if (existingUser) {
    throw new Error("Username is already taken.");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { username: newUsername },
  });

  return updatedUser;
}

export default updateUsernameMutation;
