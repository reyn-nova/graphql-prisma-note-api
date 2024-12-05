import bcrypt from "bcrypt";

import { prisma } from "../../helpers/prismaInstance";
import { checkAndGetSessionUser } from "../../helpers/user";

const updatePasswordMutation = async (
  _: any,
  args: { currentPassword: string; newPassword: string },
  context: any
) => {
  const user = checkAndGetSessionUser(context);

  const userId = user.id;

  const { currentPassword, newPassword } = args;

  // Fetch the current user
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!currentUser) {
    throw new Error("User not found.");
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);

  if (!isPasswordValid) {
    throw new Error("Invalid current password.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return updatedUser;
}

export default updatePasswordMutation;
