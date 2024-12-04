import { ApolloServer, gql } from "apollo-server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// GraphQL Schema
const typeDefs = gql`
  type User {
    id: Int!
    username: String!
    password: String!
  }

  type Note {
    id: Int!
    title: String!
    value: String!
    seenBy: [User!]! # List of users who have seen the note
    likedBy: [User!]! # List of users who have liked the note
    archivedAt: String
    owner: User!
  }

  type Query {
    me: User
    myNotes: [Note!]!
  }

  type Mutation {
    signUp(username: String!, password: String!): String! # Returns JWT
    login(username: String!, password: String!): String! # Returns JWT
    createNote(title: String!, value: String!): Note!
    markSeen(noteId: Int!): Note!
    likeNote(noteId: Int!): Note!
    archiveNote(noteId: Int!): Note!
  }
`;

// GraphQL Resolvers
const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      return prisma.user.findUnique({ where: { id: context.user.id } });
    },
    myNotes: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      return prisma.note.findMany({ where: { ownerId: context.user.id } });
    },
  },
  Mutation: {
    signUp: async (_: any, { username, password }: any) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { username, password: hashedPassword },
      });
      return jwt.sign({ id: user.id }, SECRET);
    },
    login: async (_: any, { username, password }: any) => {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid credentials");
      }
      return jwt.sign({ id: user.id }, SECRET);
    },
    createNote: async (_: any, { title, value }: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      return prisma.note.create({
        data: {
          title,
          value,
          owner: { connect: { id: context.user.id } },
        },
      });
    },
    markSeen: async (_: any, { noteId }: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      const note = await prisma.note.findUnique({ where: { id: noteId } });
      if (!note) throw new Error("Note not found");

      return prisma.note.update({
        where: { id: noteId },
        data: { seenBy: { connect: { id: context.user.id } } },
        include: { seenBy: true },
      });
    },
    likeNote: async (_: any, { noteId }: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      const note = await prisma.note.findUnique({ where: { id: noteId } });
      if (!note) throw new Error("Note not found");

      return prisma.note.update({
        where: { id: noteId },
        data: { likedBy: { connect: { id: context.user.id } } },
        include: { likedBy: true },
      });
    },
    archiveNote: async (_: any, { noteId }: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      const note = await prisma.note.findUnique({ where: { id: noteId } });
      if (!note || note.ownerId !== context.user.id) {
        throw new Error("Note not found or not authorized");
      }
      return prisma.note.update({
        where: { id: noteId },
        data: { archivedAt: new Date() },
      });
    },
  },
  Note: {
    owner: (note: any) =>
      prisma.user.findUnique({ where: { id: note.ownerId } }),
    seenBy: (note: any) =>
      prisma.user.findMany({ where: { seenNotes: { some: { id: note.id } } } }),
    likedBy: (note: any) =>
      prisma.user.findMany({ where: { likedNotes: { some: { id: note.id } } } }),
  },
};

// Middleware for extracting user from JWT
const context = async ({ req }: any) => {
  const token = req.headers.authorization || "";
  if (!token) return {};
  try {
    const decoded: any = jwt.verify(token, SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    return { user };
  } catch {
    return {};
  }
};

// Apollo Server
const server = new ApolloServer({ typeDefs, resolvers, context });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
