import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly highlights = [
    {
      title: 'Rooms',
      description: 'Cozy, well-appointed rooms with mountain views.',
      link: '/rooms',
    },
    {
      title: 'Restaurant',
      description: 'Local cuisine and wines from the Tryavna region.',
      link: '/restaurant',
    },
    {
      title: 'Pool & Spa',
      description: 'Unwind after a day exploring the Balkan trails.',
      link: '/services',
    },
    {
      title: 'Location',
      description: 'Wineries, cultural sites, and bike trails nearby.',
      link: '/location',
    },
  ];
}
