import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { ROUTE_PATHS } from '../../route-paths';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly lang = inject(LanguageService);
  protected readonly routes = ROUTE_PATHS;

  protected readonly highlights = computed(() => {
    const copy = this.lang.t().home.highlights;
    return [
      { ...copy.rooms, link: ROUTE_PATHS.rooms },
      { ...copy.restaurant, link: ROUTE_PATHS.restaurant },
      { ...copy.poolSpa, link: ROUTE_PATHS.services },
      { ...copy.location, link: ROUTE_PATHS.location },
    ];
  });

  protected readonly thingsToDo = computed(() => {
    const copy = this.lang.t().home.thingsToDo;
    return [
      { icon: 'beach_access', ...copy.poolSpa },
      { icon: 'holiday_village', ...copy.culturalSites },
      { icon: 'directions_bike', ...copy.bikeTrails },
      { icon: 'chef_hat', ...copy.localCuisine },
      { icon: 'wine_bar', ...copy.wineries },
    ];
  });
}
