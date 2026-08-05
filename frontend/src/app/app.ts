import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer';
import { AdminToolbar } from './admin/toolbar/admin-toolbar';
import { AdminAuthService } from './admin/auth/admin-auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, AdminToolbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly router = inject(Router);
  private readonly adminAuth = inject(AdminAuthService);
  private readonly currentUrl = signal(this.router.url);

  protected readonly isAdminArea = computed(() => {
    const url = this.currentUrl();
    return url.startsWith('/admin/') && !url.startsWith('/admin/login');
  });

  // Shown on every page once signed in — not just /admin/* — so clicking a
  // public nav link to preview the site never feels like it closed or logged
  // out of the admin session (the token in localStorage is untouched either way).
  protected readonly showAdminToolbar = computed(
    () => this.adminAuth.isAuthenticated() && !this.currentUrl().startsWith('/admin/login'),
  );

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));
  }
}
