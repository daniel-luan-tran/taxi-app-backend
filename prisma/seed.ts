import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async (): Promise<void> => {
  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash('123456a!', salt);
  const [driver, user, staff] = await Promise.all([
    prisma.account.create({
      data: {
        email: `driver@dalutech`,
        firstName: 'Driver',
        lastName: 'Test',
        displayName: 'Driver Test',
        password: {
          create: { password },
        },
        active: true,
        Driver: {
          create: {},
        },
      },
    }),
    prisma.account.create({
      data: {
        email: 'user@dalutech',
        firstName: 'User',
        lastName: 'Test',
        displayName: 'User Test',
        password: {
          create: { password },
        },
        active: true,
        User: {
          create: {},
        },
      },
    }),
    prisma.account.create({
      data: {
        email: 'staff@dalutech',
        firstName: 'Staff',
        lastName: 'Test',
        password: {
          create: { password },
        },
        active: true,
        Staff: {
          create: {},
        },
      },
    }),
    prisma.driverType.createMany({
      data: [{ name: 'Car' }, { name: 'Van' }, { name: 'Motobike' }],
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
