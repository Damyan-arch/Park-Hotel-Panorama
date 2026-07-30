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

  protected readonly thingsToDo = [
    {
      icon: 'beach_access',
      title: 'Pool and SPA',
      description:
        'Unwind in our SPA center with sauna, steam bath, and relaxing treatments designed to refresh body and mind.',
    },
    {
      icon: 'holiday_village',
      title: 'Cultural Sites',
      description:
        "Discover Tryavna's rich heritage with its museums, crafts, and cultural landmarks just minutes from the hotel.",
    },
    {
      icon: 'directions_bike',
      title: 'Bike Trails',
      description:
        'Explore scenic bike trails starting from the hotel, winding through forests, hills, and the charming town of Tryavna.',
    },
    {
      icon: 'chef_hat',
      title: 'Local Cuisine',
      description:
        'Taste authentic Bulgarian flavours and traditional Tryavna specialties, prepared with fresh local ingredients.',
    },
    {
      icon: 'wine_bar',
      title: 'Wineries',
      description:
        'Discover nearby wineries and enjoy tastings of fine Bulgarian wines crafted in the heart of the Balkan region.',
    },
  ];
}
