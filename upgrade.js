const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function upgradeAll() {
  const users = await prisma.user.findMany();
  if (users.length > 0) {
    for (const user of users) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN', isVerified: true }
      });
      console.log(`Upgraded ${user.email} to ADMIN.`);
    }
  } else {
    console.log("No users found in the database.");
  }
}

upgradeAll()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
