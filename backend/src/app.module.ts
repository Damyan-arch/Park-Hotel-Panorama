import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Room } from './rooms/room.entity';
import { Guest } from './guests/guest.entity';
import { Reservation } from './reservations/reservation.entity';
import { Payment } from './payments/payment.entity';
import { TranslationCache } from './translation/translation-cache.entity';
import { RoomsModule } from './rooms/rooms.module';
import { GuestsModule } from './guests/guests.module';
import { ReservationsModule } from './reservations/reservations.module';
import { PaymentsModule } from './payments/payments.module';
import { TranslationModule } from './translation/translation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Room, Guest, Reservation, Payment, TranslationCache],
      synchronize: false,
    }),
    RoomsModule,
    GuestsModule,
    ReservationsModule,
    PaymentsModule,
    TranslationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
