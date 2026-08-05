import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LanguageService } from '../i18n/language.service';
import { DbContentTranslationService } from '../i18n/db-content-translation.service';

export interface ApiSiteSettings {
  phoneNumber: string;
  address: string;
  restaurantHoursDays: string;
  restaurantHoursText: string;
}

@Injectable({ providedIn: 'root' })
export class SiteSettingsService {
  private readonly http = inject(HttpClient);
  private readonly lang = inject(LanguageService);
  private readonly dbTranslation = inject(DbContentTranslationService);

  private readonly raw = signal<ApiSiteSettings | null>(null);
  private readonly translated = signal<Record<string, string>>({});

  readonly settings = computed(() => {
    const settings = this.raw();
    if (!settings) return null;

    const translated = this.translated();
    return {
      phoneNumber: settings.phoneNumber,
      phoneHref: `tel:${settings.phoneNumber.replace(/[^+\d]/g, '')}`,
      address: translated['address'] ?? settings.address,
      restaurantHoursDays: translated['restaurantHoursDays'] ?? settings.restaurantHoursDays,
      restaurantHoursText: translated['restaurantHoursText'] ?? settings.restaurantHoursText,
    };
  });

  constructor() {
    this.http.get<ApiSiteSettings>(`${environment.apiUrl}/settings`).subscribe((settings) => {
      this.raw.set(settings);
    });

    effect(() => {
      const settings = this.raw();
      const locale = this.lang.locale();
      if (!settings) return;

      const entries = {
        address: settings.address,
        restaurantHoursDays: settings.restaurantHoursDays,
        restaurantHoursText: settings.restaurantHoursText,
      };
      this.dbTranslation.translate('settings', locale, entries).then((translated) => {
        this.translated.set(translated);
      });
    });
  }

  // Called by the admin Settings page after a successful save, so every page
  // already open in this session reflects the change immediately instead of
  // showing the stale value this service fetched once at app startup.
  setSettings(settings: ApiSiteSettings): void {
    this.raw.set(settings);
  }
}
