import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { SECRET } from "../../server";
import { prisma } from "../../helpers/prismaInstance";

const signUpMutation = async (_: any, { username, password }: any) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    return jwt.sign({ id: user.id }, SECRET);
}

export default signUpMutation;
