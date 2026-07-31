import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHero } from '../../shared/page-hero/page-hero';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-rooms',
  imports: [PageHero, RouterLink],
  templateUrl: './rooms.html',
  styleUrl: './rooms.scss',
})
export class Rooms {
  protected readonly lang = inject(LanguageService);

  protected readonly rooms = computed(() => {
    const t = this.lang.t().rooms;
    const amenities = [t.amenities.tv, t.amenities.wifi, t.amenities.ac, t.amenities.mountainView];

    return [
      {
        name: t.items.doubleRoom.name,
        sizeSqm: 30,
        maxGuests: 2,
        amenities,
        image: '/images/rooms/double-room-balcony.webp',
      },
      {
        name: t.items.apartment.name,
        sizeSqm: 42,
        maxGuests: 4,
        amenities,
        image: '/images/rooms/apartment-balcony.webp',
      },
      {
        name: t.items.tripleRoom.name,
        sizeSqm: 30,
        maxGuests: 3,
        amenities,
        image: '/images/rooms/triple-room-balcony.webp',
      },
      {
        name: t.items.townSuite.name,
        sizeSqm: 49,
        maxGuests: 4,
        amenities,
        image: '/images/rooms/town-suite.webp',
      },
    ];
  });

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.closest('.room-photo')?.classList.add('room-photo--missing');
    img.style.display = 'none';
  }
}
