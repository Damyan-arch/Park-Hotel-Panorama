import { Component, computed, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PageHero } from '../../shared/page-hero/page-hero';
import { LanguageService } from '../../i18n/language.service';
import { DbContentTranslationService } from '../../i18n/db-content-translation.service';
import { environment } from '../../../environments/environment';

interface ApiGalleryPhoto {
  id: string;
  imageUrl: string;
  altTextEn: string | null;
}

@Component({
  selector: 'app-gallery',
  imports: [PageHero],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery {
  protected readonly lang = inject(LanguageService);

  private readonly http = inject(HttpClient);
  private readonly dbTranslation = inject(DbContentTranslationService);

  private readonly apiPhotos = signal<ApiGalleryPhoto[]>([]);
  private readonly translatedAlt = signal<Record<string, string>>({});

  protected readonly photos = computed(() => {
    const translated = this.translatedAlt();
    return this.apiPhotos().map((photo) => ({
      src: photo.imageUrl,
      alt: photo.altTextEn ? translated[photo.id] ?? photo.altTextEn : '',
    }));
  });

  protected readonly activeIndex = signal<number | null>(null);

  protected readonly activePhoto = computed(() => {
    const index = this.activeIndex();
    return index === null ? null : this.photos()[index];
  });

  constructor() {
    this.http.get<ApiGalleryPhoto[]>(`${environment.apiUrl}/gallery`).subscribe((photos) => {
      this.apiPhotos.set(photos);
    });

    effect(() => {
      const photos = this.apiPhotos();
      const locale = this.lang.locale();
      if (photos.length === 0) return;

      const entries: Record<string, string> = {};
      for (const photo of photos) {
        if (photo.altTextEn) entries[photo.id] = photo.altTextEn;
      }
      this.dbTranslation.translate('gallery', locale, entries).then((translated) => {
        this.translatedAlt.set(translated);
      });
    });
  }

  open(index: number): void {
    this.activeIndex.set(index);
  }

  close(): void {
    this.activeIndex.set(null);
  }
}
