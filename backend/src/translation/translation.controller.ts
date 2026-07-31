import { Body, Controller, Post } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { TranslateBatchDto } from './dto/translate-batch.dto';

@Controller('translations')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Post()
  translate(@Body() dto: TranslateBatchDto) {
    return this.translationService.translate(dto.locale, dto.entries);
  }
}
