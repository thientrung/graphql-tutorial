import { ApolloServer } from "apollo-server";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import { prisma } from "../prisma-db/generated/prisma-client";

const server = new ApolloServer({
  playground: true,
  introspection: true,
  typeDefs,
  resolvers,
  context: req => ({
    prisma,
    req
  })
});

server.listen({port: process.env.PORT || 4000}).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
