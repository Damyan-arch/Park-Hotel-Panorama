import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from './data-source';
import { Room, RoomType } from '../rooms/room.entity';
import { GalleryPhoto } from '../gallery/gallery-photo.entity';
import { AdminUser } from '../admin-auth/admin-user.entity';

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

// Mirrors the photos the public Gallery page used to hardcode, so switching
// it over to reading from the database doesn't change what's shown.
const galleryPhotos = [
  { imageUrl: '/images/gallery/lounge-lobby.webp', altTextEn: 'Hotel lounge with mountain views', sortOrder: 0 },
  { imageUrl: '/images/gallery/restaurant-hall.webp', altTextEn: 'Restaurant dining hall', sortOrder: 1 },
  { imageUrl: '/images/gallery/twin-room.webp', altTextEn: 'Twin room', sortOrder: 2 },
  { imageUrl: '/images/gallery/room-lounge.webp', altTextEn: 'Room sitting area', sortOrder: 3 },
  { imageUrl: '/images/gallery/courtyard-garden.webp', altTextEn: 'Hotel courtyard and garden', sortOrder: 4 },
  { imageUrl: '/images/gallery/rose-garden.webp', altTextEn: 'Rose garden', sortOrder: 5 },
];

async function main() {
  await AppDataSource.initialize();

  const roomsRepository = AppDataSource.getRepository(Room);
  const roomsCount = await roomsRepository.count();
  if (roomsCount > 0) {
    console.log(`Rooms table already has ${roomsCount} row(s), skipping room seed.`);
  } else {
    await roomsRepository.save(rooms.map((room) => roomsRepository.create(room)));
    console.log(`Seeded ${rooms.length} rooms.`);
  }

  const galleryRepository = AppDataSource.getRepository(GalleryPhoto);
  const galleryCount = await galleryRepository.count();
  if (galleryCount > 0) {
    console.log(`GalleryPhoto table already has ${galleryCount} row(s), skipping gallery seed.`);
  } else {
    await galleryRepository.save(galleryPhotos.map((photo) => galleryRepository.create(photo)));
    console.log(`Seeded ${galleryPhotos.length} gallery photos.`);
  }

  const adminRepository = AppDataSource.getRepository(AdminUser);
  const adminCount = await adminRepository.count();
  if (adminCount > 0) {
    console.log('AdminUser table already has a row, skipping admin seed.');
  } else {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
      console.log('ADMIN_EMAIL/ADMIN_PASSWORD not set, skipping admin user seed.');
    } else {
      const passwordHash = await bcrypt.hash(password, 10);
      await adminRepository.save(adminRepository.create({ email, passwordHash }));
      console.log(`Seeded admin user ${email}.`);
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await AppDataSource.destroy();
  });
