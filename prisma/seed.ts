import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Add your seed logic here. Example:
  // await prisma.user.create({ data: { email: 'admin@example.com', name: 'Admin' } });

  console.log('Prisma seed script ran successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
