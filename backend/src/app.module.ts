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
import { AdminUser } from './admin-auth/admin-user.entity';
import { GalleryPhoto } from './gallery/gallery-photo.entity';
import { SiteSettings } from './site-settings/site-settings.entity';
import { RoomsModule } from './rooms/rooms.module';
import { GuestsModule } from './guests/guests.module';
import { ReservationsModule } from './reservations/reservations.module';
import { PaymentsModule } from './payments/payments.module';
import { TranslationModule } from './translation/translation.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { GalleryModule } from './gallery/gallery.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [
        Room,
        Guest,
        Reservation,
        Payment,
        TranslationCache,
        AdminUser,
        GalleryPhoto,
        SiteSettings,
      ],
      synchronize: false,
    }),
    RoomsModule,
    GuestsModule,
    ReservationsModule,
    PaymentsModule,
    TranslationModule,
    AdminAuthModule,
    GalleryModule,
    SiteSettingsModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
