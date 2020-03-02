import { gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    users(skip: Int, first: Int, orderBy: UserOrderByInput): [User]!
    posts(skip: Int, first: Int, orderBy: PostOrderByInput): [Post]!
  }
  type Mutation {
    createUser(input: UserCreateInput): User!
    updateUser(input: UserUpdateInput): User!
    deleteUser(id: ID!): User!
    login(input: LoginInput!): AuthPayload!
    createPost(input: PostCreateInput): Post!
    updatePost(input: PostUpdateInput): Post!
    deletePost(id: ID!): Post!
  }
  type Subscription {
    count: Int!
    createUser: User!
    updateUser: User!
    deleteUser: User!
  }
  input UserCreateInput {
    name: String!
    age: Int!
    email: String!
    password: String!
  }
  input UserUpdateInput {
    id: ID!
    name: String!
    age: Int!
    email: String!
    password: String!
    newPassword: String!
  }
  input LoginInput {
    email: String!
    password: String!
  }
  input PostCreateInput {
    title: String!
    body: String!
  }
  input PostUpdateInput {
    id: ID!
    title: String!
    body: String!
  }
  type AuthPayload {
    token: String!
    user: User
  }
  type User {
    id: ID
    name: String
    age: Int
    friends: [User]
    email: String!
    password: String!
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    author: ID!
  }

  enum UserOrderByInput {
    id_ASC
    id_DESC
    name_ASC
    name_DESC
    age_ASC
    age_DESC
    email_ASC
    email_DESC
    password_ASC
    password_DESC
  }

  enum PostOrderByInput {
    id_ASC
    id_DESC
    title_ASC
    title_DESC
    body_ASC
    body_DESC
    author_ASC
    author_DESC
  }
`;

export default typeDefs;
