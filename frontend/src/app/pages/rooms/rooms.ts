import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PageHero } from '../../shared/page-hero/page-hero';
import { LanguageService } from '../../i18n/language.service';
import { DbContentTranslationService } from '../../i18n/db-content-translation.service';
import { ROUTE_PATHS } from '../../route-paths';
import { environment } from '../../../environments/environment';

interface ApiRoom {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  sizeSqm: number | null;
  imageUrls: string[] | null;
}

@Component({
  selector: 'app-rooms',
  imports: [PageHero, RouterLink],
  templateUrl: './rooms.html',
  styleUrl: './rooms.scss',
})
export class Rooms {
  protected readonly lang = inject(LanguageService);
  protected readonly routes = ROUTE_PATHS;

  private readonly http = inject(HttpClient);
  private readonly dbTranslation = inject(DbContentTranslationService);

  private readonly apiRooms = signal<ApiRoom[]>([]);
  private readonly translatedText = signal<Record<string, string>>({});

  protected readonly rooms = computed(() => {
    const t = this.lang.t().rooms;
    const amenities = [t.amenities.tv, t.amenities.wifi, t.amenities.ac, t.amenities.mountainView];
    const translated = this.translatedText();

    return this.apiRooms().map((room) => ({
      id: room.id,
      name: translated[`${room.id}:name`] ?? room.name,
      description: room.description
        ? translated[`${room.id}:description`] ?? room.description
        : null,
      sizeSqm: room.sizeSqm,
      maxGuests: room.capacity,
      amenities,
      image: room.imageUrls?.[0] ?? null,
    }));
  });

  constructor() {
    this.http.get<ApiRoom[]>(`${environment.apiUrl}/rooms`).subscribe((rooms) => {
      this.apiRooms.set(rooms);
    });

    effect(() => {
      const rooms = this.apiRooms();
      const locale = this.lang.locale();
      if (rooms.length === 0) return;

      const entries: Record<string, string> = {};
      for (const room of rooms) {
        entries[`${room.id}:name`] = room.name;
        if (room.description) entries[`${room.id}:description`] = room.description;
      }
      this.dbTranslation.translate('rooms', locale, entries).then((translated) => {
        this.translatedText.set(translated);
      });
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.closest('.room-photo')?.classList.add('room-photo--missing');
    img.style.display = 'none';
  }
}
