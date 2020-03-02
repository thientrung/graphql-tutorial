// Import module PubSub (Public Subcribe) để hỗ trợ cho subcription.
import { PubSub } from "apollo-server";

// Khởi tạo pubsub
const pubsub = new PubSub();

const resolvers = {
  Query: {
    users: (root, args, context, info) => {
      return context.prisma.users({ where: { NOT: [{ id: null }] } });
    }
  },
  Mutation: {
    createUser: (root, args, context, info) => {
      return context.prisma.createUser({
        ...args.input
      });
    },
    updateUser: (root, args, context, info) => {
      return context.prisma.updateUser({
        data: { name: args.name, age: args.age },
        where: { id: args.id }
      });
    },
    deleteUser: (root, args, context, info) => {
      return await context.prisma.deleteUser({
        id: args.id
      });
    }
  },
  Subscription: {
    count: {
      subscribe: (root, args, context, info) => {
        let countData = 0;
        // Dùng interval để mỗi giây chúng ta notice 1 lần.
        setInterval(() => {
          countData++;
          // publish là function dùng để send notice tới event mà hàm asyncIterator đang lắng nghe.
          // Ở đây là event "Count-LabelEvent".
          // Ở đây cứ mỗi giây chúng ta send notice 1 lần với data là biến count
          pubsub.publish("Count-LabelEvent", {
            count: countData
          });
        }, 1000);
        // asyncIterator là function dùng để listen event async.
        // Tham số "count" là label của event mình muốn listen. (tự mình đặt: abc, xyz gì cũng OK)
        return pubsub.asyncIterator("Count-LabelEvent");
      }
    },
    createUser: {
      subscribe: (root, args, context, info) => {
        return context.prisma.$subscribe.user().node();
      }
    },
    updateUser: {
      // Subscription với Prisma, điều kiện là khi UPDATE user với age > 20
      subscribe: (root, args, context, info) => {
        return context.prisma.$subscribe
          .user({
            where: {
              mutation_in: ["UPDATED"]
            },
            node: { id: args.userId }
          })
          .node();
      },
      resolve: (payload, args, context, info) => {
        return payload;
      }
    },
    deleteUser: {
      subscribe: (root, args, context, info) => {
        return context.prisma.$subscribe
          .user(
            {
              where: {
                mutation_in: ["DELETED"]
              }
            },
            info
          )
          .previousValues();
      },
      resolve: (payload, args, context, info) => {
        return payload;
      }
    }
  }
};

export default resolvers;
