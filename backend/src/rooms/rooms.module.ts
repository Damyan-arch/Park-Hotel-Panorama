import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsController } from './rooms.controller';
import { AdminRoomsController } from './admin-rooms.controller';
import { RoomsService } from './rooms.service';
import { Room } from './room.entity';
import { AdminAuthModule } from '../admin-auth/admin-auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), AdminAuthModule],
  controllers: [RoomsController, AdminRoomsController],
  providers: [RoomsService],
  exports: [TypeOrmModule],
})
export class RoomsModule {}
