const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany();
  console.log(`There are ${users.length} users in the database:`);
  for (const user of users) {
    console.log(`- ${user.email} (Role: ${user.role})`);
  }
}

checkUsers()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
