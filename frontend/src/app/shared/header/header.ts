import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { ROUTE_PATHS } from '../../route-paths';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, LanguageSwitcher],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly lang = inject(LanguageService);
  protected readonly menuOpen = signal(false);
  protected readonly routes = ROUTE_PATHS;

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
