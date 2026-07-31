import { IsIn, IsObject, IsNotEmptyObject } from 'class-validator';

export const TRANSLATABLE_LOCALES = ['bg', 'de', 'es', 'ro'] as const;
export type TranslatableLocale = (typeof TRANSLATABLE_LOCALES)[number];

export class TranslateBatchDto {
  @IsIn(TRANSLATABLE_LOCALES)
  locale: TranslatableLocale;

  @IsObject()
  @IsNotEmptyObject()
  entries: Record<string, string>;
}
