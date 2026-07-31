import { Component, inject } from '@angular/core';
import { PageHero } from '../../shared/page-hero/page-hero';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-services',
  imports: [PageHero],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  protected readonly lang = inject(LanguageService);
}
