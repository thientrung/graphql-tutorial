const { prisma } = require("../generated/prisma-client");

async function main() {
  const times = 50;
  for (let i = 1; i <= times; i++) {
    await prisma.createUser({
      id: i,
      name: `user${i}`,
      age: i + 20,
      email: `user${i}@email.com`,
      password: "12345678"
    });

    await prisma.createPost({
      id: `post${i}`,
      title: `title${i}`,
      body: `body${i}`,
      author: `author${i}`
    });
  }
}

main().catch(e => console.error(e));
