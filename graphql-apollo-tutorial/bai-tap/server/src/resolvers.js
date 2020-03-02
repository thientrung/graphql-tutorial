// Import module PubSub (Public Subcribe) để hỗ trợ cho subcription.
import { PubSub } from "apollo-server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getUserId from "./utils/getUserId";

// Khởi tạo pubsub
const pubsub = new PubSub();

const resolvers = {
  Query: {
    users: (root, args, context, info) => {
      return context.prisma.users({
        where: { NOT: [{ id: null }] },
        skip: args.skip,
        first: args.first,
        orderBy: args.orderBy
      });
    },
    posts: (root, args, context, info) => {
      return context.prisma.posts({
        where: { NOT: [{ id: null }] },
        skip: args.skip,
        first: args.first,
        orderBy: args.orderBy
      });
    }
  },
  Mutation: {
    login: async (root, args, context, info) => {
      // Tìm kiếm user bằng email
      const user = await context.prisma.user({
        email: args.input.email
      });

      if (!user) {
        throw new Error("Unable to login");
      }

      // Dùng method compare của thư viện bcrypt để verify password
      const isMatch = await bcrypt.compare(args.input.password, user.password);

      if (!isMatch) {
        throw new Error("Unable to login");
      }

      return {
        user,
        token: jwt.sign({ userId: user.id }, "thisismysecret", {
          expiresIn: "30m"
        })
      };
    },
    createUser: async (root, args, context, info) => {
      // Check length password
      if (args.input.password.length < 8) {
        throw new Error("Password must be 8 characters or longer");
      }

      // Hash password để lưu trong database
      const password = await bcrypt.hash(args.input.password, 10);

      // Tạo user mới với thông tin từ input
      // và override password string thường bằng password đã được hash
      return context.prisma.createUser({
        ...args.input,
        password
      });
    },
    updateUser: async (root, args, context, info) => {
      // Tìm kiếm user bằng email
      const user = await context.prisma.user({
        email: args.input.email
      });

      if (!user) {
        throw new Error("Not found User!");
      }

      // Dùng method compare của thư viện bcrypt để verify password
      const isMatch = await bcrypt.compare(args.input.password, user.password);

      // Check length password
      if (args.input.newPassword.length < 8) {
        throw new Error("New Password must be 8 characters or longer");
      }

      const newPassword = await bcrypt.hash(args.input.newPassword, 10);

      if (!isMatch) {
        throw new Error("Username or Password not match!");
      }
      return context.prisma.updateUser({
        data: {
          name: args.input.name,
          age: args.input.age,
          email: args.input.email,
          password: newPassword
        },
        where: { id: args.input.id }
      });
    },
    deleteUser: async (root, args, context, info) => {
      return await context.prisma.deleteUser({
        id: args.id
      });
    },
    createPost: async (root, args, context, info) => {
      const userId = getUserId(context.req);
      return await context.prisma.createPost({
        title: args.input.title,
        body: args.input.body,
        author: userId
      });
    },
    updatePost: async (root, args, context, info) => {
      const userId = getUserId(context.req);
      return context.prisma.updatePost({
        data: {
          title: args.input.title,
          body: args.input.body,
          author: userId
        },
        where: {
          id: args.input.id
        }
      });
    },
    deletePost: async (root, args, context, info) => {
      return context.prisma.deletePost({
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
