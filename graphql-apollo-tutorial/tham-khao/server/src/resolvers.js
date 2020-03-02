// Import module PubSub (Public Subcribe) để hỗ trợ cho subcription.
import { PubSub } from "apollo-server";
// Khởi tạo pubsub
const pubsub = new PubSub();

let users = [
  {
    id: 1,
    name: "Jone",
    age: 20
  },
  {
    id: 2,
    name: "Aily",
    age: 25
  },
  {
    id: 3,
    name: "Mina",
    age: 30
  }
];

const resolvers = {
  Query: {
    users: (root, args, context, info) => users
  },
  Mutation: {
    createUser: (root, args, context, info) => {
      // Tạo mới User
      let newUser = {
        id: users.length + 1,
        ...args.input
      };
      // Thêm vào mảng User
      users.push(newUser);

      return newUser;
    },
    updateUser: (root, args, context, info) => {
      // Kiểm tra sự tồn tại của user
      const userIndex = users.findIndex(user => user.id == args.id);

      // Trả về lỗi nếu không tồn tại
      if (userIndex === -1) {
        throw new Error("User not found!");
      }

      // Tiến hành update user trong mảng.
      users[userIndex].age = args.age;
      users[userIndex].name = args.name;
      // Send notice tới event đang được subscription theo id
      pubsub.publish(`UPDATE_USER_${args.id}`, { updateUser: users[userIndex] });
      // Trả user đã update về lại cho client
      return users[userIndex];
    },
    deleteUser: (root, args, context, info) => {
      // Kiểm tra sự tồn tại của user
      const userIndex = users.findIndex(user => user.id == args.id);

      if (userIndex === -1) {
        throw new Error("User not found!");
      }

      users.splice(userIndex, 1);

      return true;
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
    updateUser: {
      subscribe: (root, args, context, info) => {
        // Kiểm tra sự tồn tại của user
        const userIndex = users.findIndex(user => user.id == args.userId);

        // Trả về lỗi nếu không tồn tại
        if (userIndex === -1) {
          throw new Error("User not found!");
        }
        // asyncIterator là function dùng để listen event async.
        // Chúng ta sẽ lắng nghe event update tới userId nhất định.
        return pubsub.asyncIterator(`UPDATE_USER_${args.userId}`);
      }
    }
  }
};

export default resolvers;
