import {gql} from 'apollo-server';

const typeDefs = gql`
  type Query {
    user(id: ID!): User!
  }

  type User {
    id: ID!
    name: String!
    age: Int
    friends: [User]
  }
`;

export default typeDefs;
