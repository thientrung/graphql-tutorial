import {gql} from 'apollo-server';

const typeDefs = gql`
  type Query {
    users: [User]!
    posts: [Post]!
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
`;

export default typeDefs;
