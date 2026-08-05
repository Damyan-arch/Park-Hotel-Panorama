import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { SiteSettingsService } from '../../core/site-settings.service';
import { ROUTE_PATHS } from '../../route-paths';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly lang = inject(LanguageService);
  protected readonly siteSettings = inject(SiteSettingsService);
  protected readonly currentYear = new Date().getFullYear();
  protected readonly routes = ROUTE_PATHS;
}
