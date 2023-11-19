import { BOOKINGTYPE, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async (): Promise<void> => {
  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash('123456a!', salt);
  await Promise.all([
    prisma.driverType.createMany({
      data: [
        {
          name: 'Car',
          priceUsd: 1,
        },
        {
          name: 'Van',
          priceUsd: 2,
        },
        {
          name: 'Motobike',
          priceUsd: 0.5,
        },
      ],
    }),
  ]);
  const [
    driver,
    passenger,
    driver_tan,
    driver_minh,
    driver_luan,
    passenger_ha,
    passenger_linh,
    passenger_lan,
  ] = await Promise.all([
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
          create: {
            driverTypeId: 1,
          },
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
        email: `driver-tan@dalutech`,
        firstName: 'Driver Tan',
        lastName: 'Test',
        displayName: 'Driver Tan Test',
        password: {
          create: { password },
        },
        active: true,
        Driver: {
          create: {
            driverTypeId: 2,
          },
        },
      },
    }),
    prisma.account.create({
      data: {
        email: `driver-minh@dalutech`,
        firstName: 'Driver Minh',
        lastName: 'Test',
        displayName: 'Driver Minh Test',
        password: {
          create: { password },
        },
        active: true,
        Driver: {
          create: {
            driverTypeId: 1,
          },
        },
      },
    }),
    prisma.account.create({
      data: {
        email: `driver-luan@dalutech`,
        firstName: 'Driver Luan',
        lastName: 'Test',
        displayName: 'Driver Luan Test',
        password: {
          create: { password },
        },
        active: true,
        Driver: {
          create: {
            driverTypeId: 3,
          },
        },
      },
    }),
    prisma.account.create({
      data: {
        email: 'passenger-ha@dalutech',
        firstName: 'Passenger Ha',
        lastName: 'Test',
        displayName: 'Passenger Ha Test',
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
        email: 'passenger-linh@dalutech',
        firstName: 'Passenger Linh',
        lastName: 'Test',
        displayName: 'Passenger Linh Test',
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
        email: 'passenger-lan@dalutech',
        firstName: 'Passenger Lan',
        lastName: 'Test',
        displayName: 'Passenger Lan Test',
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
        displayName: 'Staff Test',
        password: {
          create: { password },
        },
        active: true,
        Staff: {
          create: {},
        },
      },
    }),
  ]);

  const today = new Date();

  await Promise.all([
    prisma.bookingHistory.createMany({
      data: [
        {
          userId: passenger_ha.id,
          driverId: driver_tan.id,
          bookAt: today,
          startLat: 10.7400238,
          startLng: 106.6363544,
          endLat: 10.7769942,
          endLng: 106.6953021,
          bookingType: BOOKINGTYPE.PHONE_CALL,
        },
        {
          userId: passenger_linh.id,
          driverId: driver_minh.id,
          bookAt: new Date(today.setDate(today.getDate() - 1)),
          startLat: 10.7417608,
          startLng: 106.6302047,
          endLat: 10.7558398,
          endLng: 106.6584927,
          bookingType: BOOKINGTYPE.MOBILE_APP,
        },
        {
          userId: passenger_lan.id,
          driverId: driver_luan.id,
          bookAt: new Date(today.setDate(today.getDate() - 3)),
          startLat: 10.7496697,
          startLng: 106.648409,
          endLat: 10.7547937,
          endLng: 106.6320756,
          bookingType: BOOKINGTYPE.PHONE_CALL,
        },
        {
          userId: passenger.id,
          driverId: driver.id,
          bookAt: new Date(today.setDate(today.getDate() - 5)),
          startLat: 10.7502834,
          startLng: 106.64002,
          endLat: 10.7543178,
          endLng: 106.6300274,
          bookingType: BOOKINGTYPE.MOBILE_APP,
        },
      ],
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
