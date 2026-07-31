import { Component, inject } from '@angular/core';
import { PageHero } from '../../shared/page-hero/page-hero';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-location',
  imports: [PageHero],
  templateUrl: './location.html',
  styleUrl: './location.scss',
})
export class Location {
  protected readonly lang = inject(LanguageService);
}
