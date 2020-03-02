import {gql} from 'apollo-server';

const typeDefs = gql`
  type Query {
    users: [User]!
  }

  type Mutation {
    createUser(input: UserInput): User!
    updateUser(id: ID!, name: String!, age: Int!): User!
    deleteUser(id: ID!): Boolean!
  }

  type Subscription {
    count: Int!
    updateUser(userId: ID!): User!
  }

  input UserInput {
    name: String!
    age: Int!
  }

  type User {
    id: ID
    name: String
    age: Int
    friends: [User]
  }
`;

export default typeDefs;
