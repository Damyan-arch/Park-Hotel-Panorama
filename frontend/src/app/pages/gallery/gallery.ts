import { Component, computed, inject, signal } from '@angular/core';
import { PageHero } from '../../shared/page-hero/page-hero';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-gallery',
  imports: [PageHero],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery {
  protected readonly lang = inject(LanguageService);

  protected readonly photos = computed(() => {
    const alt = this.lang.t().gallery.alt;
    return [
      { src: '/images/gallery/lounge-lobby.webp', alt: alt.loungeLobby },
      { src: '/images/gallery/restaurant-hall.webp', alt: alt.restaurantHall },
      { src: '/images/gallery/twin-room.webp', alt: alt.twinRoom },
      { src: '/images/gallery/room-lounge.webp', alt: alt.roomLounge },
      { src: '/images/gallery/courtyard-garden.webp', alt: alt.courtyardGarden },
      { src: '/images/gallery/rose-garden.webp', alt: alt.roseGarden },
    ];
  });

  protected readonly activeIndex = signal<number | null>(null);

  protected readonly activePhoto = computed(() => {
    const index = this.activeIndex();
    return index === null ? null : this.photos()[index];
  });

  open(index: number): void {
    this.activeIndex.set(index);
  }

  close(): void {
    this.activeIndex.set(null);
  }
}
