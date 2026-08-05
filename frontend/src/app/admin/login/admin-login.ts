import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AdminAuthService } from '../auth/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss',
})
export class AdminLogin {
  private readonly fb = new FormBuilder();
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.submitting.set(true);

    this.http
      .post<{ token: string }>(`${environment.apiUrl}/admin/auth/login`, this.form.getRawValue())
      .subscribe({
        next: ({ token }) => {
          this.auth.setToken(token);
          this.submitting.set(false);
          this.router.navigateByUrl('/admin/rooms');
        },
        error: () => {
          this.submitting.set(false);
          this.errorMessage.set('Invalid email or password.');
        },
      });
  }
}
