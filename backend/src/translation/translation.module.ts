import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationController } from './translation.controller';
import { TranslationService } from './translation.service';
import { TranslationCache } from './translation-cache.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TranslationCache])],
  controllers: [TranslationController],
  providers: [TranslationService],
})
export class TranslationModule {}
