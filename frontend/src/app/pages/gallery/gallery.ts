import { Component, signal } from '@angular/core';
import { PageHero } from '../../shared/page-hero/page-hero';

interface GalleryPhoto {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-gallery',
  imports: [PageHero],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery {
  protected readonly photos: GalleryPhoto[] = [
    { src: '/images/gallery/lounge-lobby.webp', alt: 'Hotel lounge with mountain views' },
    { src: '/images/gallery/restaurant-hall.webp', alt: 'Restaurant dining hall' },
    { src: '/images/gallery/twin-room.webp', alt: 'Twin room' },
    { src: '/images/gallery/room-lounge.webp', alt: 'Room sitting area' },
    { src: '/images/gallery/courtyard-garden.webp', alt: 'Hotel courtyard and garden' },
    { src: '/images/gallery/rose-garden.webp', alt: 'Rose garden' },
  ];

  protected readonly activeIndex = signal<number | null>(null);

  open(index: number): void {
    this.activeIndex.set(index);
  }

  close(): void {
    this.activeIndex.set(null);
  }
}
