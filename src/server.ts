import { ApolloServer } from "apollo-server";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { prisma } from "./helpers/prismaInstance";
import resolvers from "./resolvers";
import typeDefs from "./helpers/typeDefs";

dotenv.config();

export const SECRET = process.env.JWT_SECRET || "";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }: any) => {
    const token = req.headers.authorization || "";

    if (!token) return {};

    try {
      const decoded: any = jwt.verify(token, SECRET);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      
      return { user };
    } catch {
      return {};
    }
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
