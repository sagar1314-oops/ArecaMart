const { prisma } = require("./lib/prisma");

async function test() {
  console.log("Testing Prisma connection from lib/prisma.ts...");
  console.log("DATABASE_URL:", process.env.DATABASE_URL ? "SET" : "NOT SET");

  try {
    await prisma.$connect();
    console.log("✅ Connected successfully");

    const count = await prisma.blog_posts.count();
    console.log(`✅ Found ${count} blog posts`);

    const posts = await prisma.blog_posts.findMany();
    console.log("✅ Posts:", JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
