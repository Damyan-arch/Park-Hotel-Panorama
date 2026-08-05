import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AdminAuthService } from '../auth/admin-auth.service';

@Component({
  selector: 'app-admin-toolbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-toolbar.html',
  styleUrl: './admin-toolbar.scss',
})
export class AdminToolbar {
  private readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/admin/login');
  }
}
