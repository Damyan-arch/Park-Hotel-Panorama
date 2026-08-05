import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser } from './admin-user.entity';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthGuard } from './admin-auth.guard';

const jwtModule = JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '12h' },
});

@Module({
  imports: [TypeOrmModule.forFeature([AdminUser]), jwtModule],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, AdminAuthGuard],
  // JwtModule is re-exported alongside the guard because AdminAuthGuard
  // depends on JwtService — modules that import AdminAuthModule just to use
  // @UseGuards(AdminAuthGuard) need that dependency visible too, otherwise
  // Nest fails to construct the guard in their own module context.
  exports: [AdminAuthGuard, jwtModule],
})
export class AdminAuthModule {}
