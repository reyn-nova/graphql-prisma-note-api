import { gql } from "apollo-server";

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

export default typeDefs;
