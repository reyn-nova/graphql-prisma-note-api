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
    listNotes(ownerId: Int): [Note!]!
  }

  type Mutation {
    signUp(username: String!, password: String!): String! # Returns JWT
    login(username: String!, password: String!): String! # Returns JWT
    createNote(title: String!, value: String!): Note!
    markSeen(noteId: Int!): Note!
    toggleLikeNote(noteId: Int!): Note! # Toggles the like status
    toggleArchiveNote(noteId: Int!): Note! # Toggles the archive status
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
    listNotes: async (_: any, args: any, context: any) => {
      // Destructure ownerId from arguments
      const { ownerId } = args;

      const where: any = {
        archivedAt: null,
      };
      if (ownerId) {
        where.id = ownerId;
      }

      return prisma.note.findMany({
        where,
        include: {
          owner: true,
          seenBy: true,
          likedBy: true,
        },
      });
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
    toggleLikeNote: async (_: any, args: { noteId: number }, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      const userId = context.user.id;

      const { noteId } = args;

      const note = await prisma.note.findUnique({
        where: { id: noteId },
        include: { likedBy: true },
      });

      if (!note) {
        throw new Error("Note not found.");
      }

      const isLiked = note.likedBy.some((user) => user.id === userId);

      const updatedNote = await prisma.note.update({
        where: { id: noteId },
        data: {
          likedBy: isLiked
            ? { disconnect: { id: userId } }
            : { connect: { id: userId } },
        },
        include: {
          likedBy: true,
          seenBy: true,
          owner: true,
        },
      });

      return updatedNote;
    },
    toggleArchiveNote: async (_: any, args: { noteId: number }, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      const userId = context.user.id;

      const { noteId } = args;
      
      const note = await prisma.note.findUnique({
        where: { id: noteId },
      });

      if (!note || note.ownerId !== userId) {
        throw new Error("You do not have permission to toggle archive status for this note.");
      }

      // Toggle the archivedAt field
      const updatedNote = await prisma.note.update({
        where: { id: noteId },
        data: {
          archivedAt: note.archivedAt ? null : new Date().toISOString(),
        },
        include: {
          likedBy: true,
          seenBy: true,
          owner: true,
        },
      });

      return updatedNote;
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
