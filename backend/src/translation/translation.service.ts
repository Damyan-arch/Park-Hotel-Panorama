import { createHash } from 'crypto';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TranslatableLocale } from './dto/translate-batch.dto';

const DEEPL_TARGET_LANG: Record<TranslatableLocale, string> = {
  bg: 'BG',
  de: 'DE',
  es: 'ES',
  ro: 'RO',
};

// DeepL rejects requests with more than 50 texts, so missing strings are
// translated in batches rather than one request per site's worth of copy.
const DEEPL_BATCH_SIZE = 50;

function hashText(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

interface DeepLResponse {
  translations: { text: string }[];
}

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async translate(
    locale: TranslatableLocale,
    entries: Record<string, string>,
  ): Promise<Record<string, string>> {
    const keys = Object.keys(entries);
    const hashByKey = new Map(keys.map((key) => [key, hashText(entries[key])]));
    const uniqueHashes = [...new Set(hashByKey.values())];

    const cached = await this.prisma.translationCache.findMany({
      where: { locale, sourceHash: { in: uniqueHashes } },
    });
    const translatedByHash = new Map(cached.map((row) => [row.sourceHash, row.translatedText]));

    const missingHashSet = new Set(uniqueHashes.filter((hash) => !translatedByHash.has(hash)));
    if (missingHashSet.size > 0) {
      const textByHash = new Map<string, string>();
      for (const key of keys) {
        const hash = hashByKey.get(key)!;
        if (missingHashSet.has(hash) && !textByHash.has(hash)) {
          textByHash.set(hash, entries[key]);
        }
      }

      const missingEntries = [...missingHashSet].map((hash) => ({ hash, text: textByHash.get(hash)! }));

      // Each batch is independent — a failure translating one batch falls
      // back to English for just those strings rather than discarding
      // translations that other batches already completed successfully.
      for (const batch of chunk(missingEntries, DEEPL_BATCH_SIZE)) {
        try {
          const translatedTexts = await this.callDeepL(
            batch.map((entry) => entry.text),
            locale,
          );
          await this.prisma.translationCache.createMany({
            data: batch.map((entry, index) => ({
              locale,
              sourceHash: entry.hash,
              sourceText: entry.text,
              translatedText: translatedTexts[index],
            })),
            skipDuplicates: true,
          });
          batch.forEach((entry, index) => translatedByHash.set(entry.hash, translatedTexts[index]));
        } catch (error) {
          this.logger.warn(
            `Falling back to English for a batch of ${batch.length} strings (${locale}): ${(error as Error).message}`,
          );
          batch.forEach((entry) => translatedByHash.set(entry.hash, entry.text));
        }
      }
    }

    const result: Record<string, string> = {};
    for (const key of keys) {
      result[key] = translatedByHash.get(hashByKey.get(key)!) ?? entries[key];
    }
    return result;
  }

  private async callDeepL(texts: string[], locale: TranslatableLocale): Promise<string[]> {
    const apiKey = process.env.DEEPL_API_KEY;
    if (!apiKey) {
      throw new Error('Translation is not configured (missing DEEPL_API_KEY).');
    }
    const apiUrl = process.env.DEEPL_API_URL ?? 'https://api-free.deepl.com/v2/translate';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: texts,
        source_lang: 'EN',
        target_lang: DEEPL_TARGET_LANG[locale],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      this.logger.error(`DeepL request failed (${response.status}): ${body}`);
      throw new Error(`DeepL request failed (${response.status})`);
    }

    const data = (await response.json()) as DeepLResponse;
    return data.translations.map((entry) => entry.text);
  }
}
