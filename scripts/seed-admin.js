const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const adminPhone = process.env.ADMIN_PHONE || "7975585413";

  console.log(`Seeding Admin user with phone: ${adminPhone}...`);

  const admin = await prisma.users.upsert({
    where: { phone: adminPhone },
    update: { role: "admin" },
    create: {
      phone: adminPhone,
      name: "Super Admin",
      role: "admin",
      phone_verified: true,
      address: "Headquarters",
      email: "admin@arecamart.com",
    },
  });

  console.log("Admin user created/updated:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
