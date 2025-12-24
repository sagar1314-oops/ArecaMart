const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Connecting to database...");
  try {
    await prisma.$connect();
    console.log("Connected successfully.");

    console.log("Fetching blog posts...");
    const posts = await prisma.blog_posts.findMany();
    console.log(`Found ${posts.length} blog posts.`);
    console.log(JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
