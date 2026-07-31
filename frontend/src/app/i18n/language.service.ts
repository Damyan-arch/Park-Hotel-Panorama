import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DEFAULT_LOCALE, Locale, LOCALE_OPTIONS, Translations } from './translations.model';
import { en } from './locales/en';

const STORAGE_KEY = 'park-hotel-locale';
const CACHE_KEY_PREFIX = 'park-hotel-translations-';

// Bump this whenever a server-side translation fix (provider swap, corruption
// filter, cache wipe, etc.) needs to invalidate every browser's cached
// translations even though the English source text itself hasn't changed.
const CLIENT_CACHE_VERSION = 2;

type FlatDict = Record<string, string>;

function isLocale(value: string | null): value is Locale {
  return !!value && LOCALE_OPTIONS.some((option) => option.code === value);
}

function flatten(value: unknown, path: string, out: FlatDict): void {
  if (typeof value === 'string') {
    out[path] = value;
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => flatten(item, `${path}.${index}`, out));
    return;
  }
  for (const key of Object.keys(value as Record<string, unknown>)) {
    flatten((value as Record<string, unknown>)[key], path ? `${path}.${key}` : key, out);
  }
}

function unflatten(flat: FlatDict): Translations {
  const root: Record<string, unknown> = {};
  for (const path of Object.keys(flat)) {
    const parts = path.split('.');
    let node = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const key = parts[i];
      const nextIsIndex = /^\d+$/.test(parts[i + 1]);
      if (!(key in node)) {
        node[key] = nextIsIndex ? [] : {};
      }
      node = node[key] as Record<string, unknown>;
    }
    node[parts[parts.length - 1]] = flat[path];
  }
  return root as unknown as Translations;
}

// Cheap non-cryptographic hash used only to detect when the English source
// copy has changed, so a stale cached translation isn't served forever.
function hashSource(flat: FlatDict): string {
  const text = JSON.stringify(flat);
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (Math.imul(hash, 31) + text.charCodeAt(i)) | 0;
  }
  return hash.toString(36);
}

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly http = inject(HttpClient);

  readonly options = LOCALE_OPTIONS;
  readonly locale = signal<Locale>(this.readInitialLocale());
  readonly isTranslating = signal(false);

  private readonly englishFlat = this.flattenEnglish();
  private readonly sourceVersion = `${CLIENT_CACHE_VERSION}:${hashSource(this.englishFlat)}`;
  private readonly translated = signal<Translations | null>(null);

  readonly t = computed<Translations>(() => this.translated() ?? en);

  constructor() {
    if (this.locale() !== 'en') {
      this.loadTranslations(this.locale());
    }
  }

  setLocale(locale: Locale): void {
    this.locale.set(locale);
    localStorage.setItem(STORAGE_KEY, locale);

    if (locale === 'en') {
      this.translated.set(null);
      return;
    }
    this.loadTranslations(locale);
  }

  private loadTranslations(locale: Locale): void {
    const cacheKey = `${CACHE_KEY_PREFIX}${locale}`;
    const cachedRaw = localStorage.getItem(cacheKey);
    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw) as { version: string; entries: FlatDict };
        if (cached.version === this.sourceVersion) {
          this.translated.set(unflatten(cached.entries));
          return;
        }
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }

    this.translated.set(null); // show English while the translation loads
    this.isTranslating.set(true);
    this.http
      .post<FlatDict>(`${environment.apiUrl}/translations`, {
        locale,
        entries: this.englishFlat,
      })
      .subscribe({
        next: (translatedFlat) => {
          const merged = { ...this.englishFlat, ...translatedFlat };
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ version: this.sourceVersion, entries: merged }),
          );
          if (this.locale() === locale) {
            this.translated.set(unflatten(merged));
          }
          this.isTranslating.set(false);
        },
        error: () => {
          this.isTranslating.set(false);
        },
      });
  }

  private flattenEnglish(): FlatDict {
    const flat: FlatDict = {};
    flatten(en, '', flat);
    return flat;
  }

  private readInitialLocale(): Locale {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isLocale(stored) ? stored : DEFAULT_LOCALE;
  }
}
