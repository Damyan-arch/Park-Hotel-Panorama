import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// NOTE: basePricePerNight values below are placeholders — replace with real rates before launch.
const rooms = [
  {
    name: 'Double Room with Balcony',
    type: 'DOUBLE' as const,
    capacity: 2,
    basePricePerNight: 70,
    imageUrls: ['/images/rooms/double-room-balcony.webp'],
  },
  {
    name: 'Apartment with Balcony',
    type: 'SUITE' as const,
    capacity: 4,
    basePricePerNight: 100,
    imageUrls: ['/images/rooms/apartment-balcony.webp'],
  },
  {
    name: 'Triple Room with Balcony',
    type: 'FAMILY' as const,
    capacity: 3,
    basePricePerNight: 85,
    imageUrls: ['/images/rooms/triple-room-balcony.webp'],
  },
  {
    name: 'Town Suite',
    type: 'SUITE' as const,
    capacity: 4,
    basePricePerNight: 110,
    imageUrls: ['/images/rooms/town-suite.webp'],
  },
];

async function main() {
  const existingCount = await prisma.room.count();
  if (existingCount > 0) {
    console.log(`Rooms table already has ${existingCount} row(s), skipping seed.`);
    return;
  }

  await prisma.room.createMany({ data: rooms });
  console.log(`Seeded ${rooms.length} rooms.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
