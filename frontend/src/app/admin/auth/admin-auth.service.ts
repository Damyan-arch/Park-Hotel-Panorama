import { Injectable, computed, signal } from '@angular/core';

const TOKEN_KEY = 'park-hotel-admin-token';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly isAuthenticated = computed(() => this.token() !== null);

  getToken(): string | null {
    return this.token();
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.token.set(token);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.token.set(null);
  }
}
