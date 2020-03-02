const resolvers = {
  Query: {
    user: (root, args, context, info) => ({
      id: args.id,
      name: `TrungTT-${args.id}`,
      age: 25,
      friends: [
        {
          id: '123',
          name: `TrongVN-123`,
          age: 25,
        },
        {
          id: '456',
          name: 'AnhTQ',
          age: '40'
        }
      ]
    })
  }
};

export default resolvers;
