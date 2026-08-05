import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Locale } from './translations.model';

type FlatDict = Record<string, string>;

const CACHE_KEY_PREFIX = 'park-hotel-db-translations-';
const CACHE_VERSION = 1;

// Same non-cryptographic hash used by LanguageService, applied here to
// database-sourced text (room descriptions, gallery captions, hours) so it
// can be translated and cached through the exact same /api/translations
// pipeline as the static site copy.
function hashSource(flat: FlatDict): string {
  const text = JSON.stringify(flat);
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (Math.imul(hash, 31) + text.charCodeAt(i)) | 0;
  }
  return hash.toString(36);
}

@Injectable({ providedIn: 'root' })
export class DbContentTranslationService {
  private readonly http = inject(HttpClient);

  async translate(namespace: string, locale: Locale, entries: FlatDict): Promise<FlatDict> {
    if (locale === 'en' || Object.keys(entries).length === 0) {
      return entries;
    }

    const version = `${CACHE_VERSION}:${hashSource(entries)}`;
    const cacheKey = `${CACHE_KEY_PREFIX}${namespace}-${locale}`;
    const cachedRaw = localStorage.getItem(cacheKey);
    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw) as { version: string; entries: FlatDict };
        if (cached.version === version) {
          return cached.entries;
        }
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }

    try {
      const translated = await firstValueFrom(
        this.http.post<FlatDict>(`${environment.apiUrl}/translations`, { locale, entries }),
      );
      const merged = { ...entries, ...translated };
      localStorage.setItem(cacheKey, JSON.stringify({ version, entries: merged }));
      return merged;
    } catch {
      return entries;
    }
  }
}
