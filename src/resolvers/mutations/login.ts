import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { SECRET } from "../../server";
import { prisma } from "../../helpers/prismaInstance";

const loginMutation = async (_: any, { username, password }: any) => {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }
    return jwt.sign({ id: user.id }, SECRET);
}

export default loginMutation;