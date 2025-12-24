const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const correctAdminPhone = "7975585413";
  const duplicateAdminPhone = "9999999999";

  console.log(`Checking for admin users...`);

  // Find all admins
  const admins = await prisma.users.findMany({
    where: { role: "admin" },
  });

  console.log(
    `Found ${admins.length} admin(s):`,
    admins.map((u) => ({ id: u.id, phone: u.phone, name: u.name }))
  );

  // Check if duplicate exists
  const duplicate = admins.find((u) => u.phone === duplicateAdminPhone);

  if (duplicate) {
    console.log(
      `Removing duplicate admin: ${duplicate.name} (${duplicate.phone})...`
    );
    // Delete the duplicate user
    // Note: If they have related records (products, etc.), this might fail.
    // But since it's a seed user, likely valid to delete or just change role.
    // We will try deleting first as it's cleaner for "only one user".
    try {
      // Check for dependencies first?
      // If the seed created sellers/products, deleting user might need cascade or failing.
      // Let's safe delete (downgrade role first just in case, then delete if possible,
      // but user 'Super Admin' 9999999999 probably has no real data).

      await prisma.users.delete({
        where: { id: duplicate.id },
      });
      console.log("Successfully deleted duplicate admin.");
    } catch (e) {
      console.error(
        "Failed to delete duplicate admin (might have related data), demoting instead...",
        e.message
      );
      await prisma.users.update({
        where: { id: duplicate.id },
        data: { role: "buyer" }, // Demote to buyer
      });
      console.log("Demoted duplicate admin to 'buyer'.");
    }
  } else {
    console.log("No duplicate admin (9999999999) found.");
  }

  // Double check
  const finalAdmins = await prisma.users.count({ where: { role: "admin" } });
  console.log(`Total admin users now: ${finalAdmins}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
