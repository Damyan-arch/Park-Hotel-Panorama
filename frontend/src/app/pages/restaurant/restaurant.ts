import { Component, inject } from '@angular/core';
import { PageHero } from '../../shared/page-hero/page-hero';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-restaurant',
  imports: [PageHero],
  templateUrl: './restaurant.html',
  styleUrl: './restaurant.scss',
})
export class Restaurant {
  protected readonly lang = inject(LanguageService);
}
