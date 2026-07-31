import 'dotenv/config';
import { AppDataSource } from './data-source';
import { Room, RoomType } from '../rooms/room.entity';

// NOTE: basePricePerNight values below are placeholders — replace with real rates before launch.
const rooms = [
  {
    name: 'Double Room with Balcony',
    type: RoomType.DOUBLE,
    capacity: 2,
    basePricePerNight: '70',
    imageUrls: ['/images/rooms/double-room-balcony.webp'],
  },
  {
    name: 'Apartment with Balcony',
    type: RoomType.SUITE,
    capacity: 4,
    basePricePerNight: '100',
    imageUrls: ['/images/rooms/apartment-balcony.webp'],
  },
  {
    name: 'Triple Room with Balcony',
    type: RoomType.FAMILY,
    capacity: 3,
    basePricePerNight: '85',
    imageUrls: ['/images/rooms/triple-room-balcony.webp'],
  },
  {
    name: 'Town Suite',
    type: RoomType.SUITE,
    capacity: 4,
    basePricePerNight: '110',
    imageUrls: ['/images/rooms/town-suite.webp'],
  },
];

async function main() {
  await AppDataSource.initialize();
  const roomsRepository = AppDataSource.getRepository(Room);

  const existingCount = await roomsRepository.count();
  if (existingCount > 0) {
    console.log(`Rooms table already has ${existingCount} row(s), skipping seed.`);
    return;
  }

  await roomsRepository.save(rooms.map((room) => roomsRepository.create(room)));
  console.log(`Seeded ${rooms.length} rooms.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await AppDataSource.destroy();
  });
