import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async (): Promise<void> => {
  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash('blackbook@1', salt);
  const [admin, staff] = await Promise.all([
    prisma.user.create({
      data: {
        email: `admin@blackbook`,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        password: {
          create: { password },
        },
        active: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'staff@blackbook',
        firstName: 'Staff',
        lastName: 'User',
        role: 'STAFF',
        password: {
          create: { password },
        },
        active: true,
      },
    }),
  ]);
};

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
