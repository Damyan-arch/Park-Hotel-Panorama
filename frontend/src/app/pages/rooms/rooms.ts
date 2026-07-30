import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHero } from '../../shared/page-hero/page-hero';

interface Room {
  name: string;
  sizeSqm: number;
  maxGuests: number;
  amenities: string[];
  image: string;
}

@Component({
  selector: 'app-rooms',
  imports: [PageHero, RouterLink],
  templateUrl: './rooms.html',
  styleUrl: './rooms.scss',
})
export class Rooms {
  protected readonly rooms: Room[] = [
    {
      name: 'Double Room with Balcony',
      sizeSqm: 30,
      maxGuests: 2,
      amenities: ['TV', 'Wifi', 'AC', 'Mountain View'],
      image: '/images/rooms/double-room-balcony.webp',
    },
    {
      name: 'Apartment with Balcony',
      sizeSqm: 42,
      maxGuests: 4,
      amenities: ['TV', 'Wifi', 'AC', 'Mountain View'],
      image: '/images/rooms/apartment-balcony.webp',
    },
    {
      name: 'Triple Room with Balcony',
      sizeSqm: 30,
      maxGuests: 3,
      amenities: ['TV', 'Wifi', 'AC', 'Mountain View'],
      image: '/images/rooms/triple-room-balcony.webp',
    },
    {
      name: 'Town Suite',
      sizeSqm: 49,
      maxGuests: 4,
      amenities: ['TV', 'Wifi', 'AC', 'Mountain View'],
      image: '/images/rooms/town-suite.webp',
    },
  ];

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.closest('.room-photo')?.classList.add('room-photo--missing');
    img.style.display = 'none';
  }
}
