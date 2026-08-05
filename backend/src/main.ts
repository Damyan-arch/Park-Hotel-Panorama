// Must run before AppModule is imported below: AdminAuthModule reads
// process.env.JWT_SECRET at module-definition time (for JwtModule.register),
// which happens as AppModule's import chain is resolved — before
// ConfigModule.forRoot() would otherwise get a chance to load .env.
import 'dotenv/config';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:4201',
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // Lets the Angular dev server proxy everything under /api to this backend
  // (see frontend/proxy.conf.json), so both apps are reachable through a
  // single origin/tunnel URL instead of two separate ports.
  app.setGlobalPrefix('api');

  // Admin-uploaded room/gallery photos are served straight from disk,
  // outside the /api prefix (frontend/proxy.conf.json forwards /uploads/**
  // here too).
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  const config = new DocumentBuilder()
    .setTitle('Park Hotel Panorama API')
    .setDescription(
      'Reservations and payments API for the guest-facing website',
    )
    .setVersion('0.1')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
