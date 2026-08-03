import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Room } from '../rooms/room.entity';
import { Guest } from '../guests/guest.entity';
import { Reservation } from '../reservations/reservation.entity';
import { Payment } from '../payments/payment.entity';
import { TranslationCache } from '../translation/translation-cache.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Room, Guest, Reservation, Payment, TranslationCache],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
