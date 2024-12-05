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
    comments: [Comment!]!
  }

  type Comment {
    id: Int!
    content: String!
    createdAt: String!
    author: User!
    note: Note!
   }

  type Query {
    myProfile: User
    myNotes: [Note!]!
    listNotes(ownerId: Int): [Note!]!
    noteComments(noteId: Int!): [Comment!]!
  }

  type Mutation {
    signUp(username: String!, password: String!): String! # Returns JWT
    login(username: String!, password: String!): String! # Returns JWT
    updateUsername(newUsername: String!): User!
    updatePassword(currentPassword: String!, newPassword: String!): User!
    createNote(title: String!, value: String!): Note!
    updateNote(noteId: Int!, title: String, value: String): Note!
    toggleArchiveNote(noteId: Int!): Note! # Toggles the archive status
    markSeenNote(noteId: Int!): Note!
    toggleLikeNote(noteId: Int!): Note! # Toggles the like status
    addComment(noteId: Int!, content: String!): Comment!
    deleteComment(commentId: Int!): Boolean!
  }
`;

export default typeDefs;
