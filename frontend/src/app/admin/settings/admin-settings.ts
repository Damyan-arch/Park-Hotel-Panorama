import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ApiSiteSettings, SiteSettingsService } from '../../core/site-settings.service';

@Component({
  selector: 'app-admin-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-settings.html',
  styleUrl: './admin-settings.scss',
})
export class AdminSettings {
  private readonly http = inject(HttpClient);
  private readonly fb = new FormBuilder();
  private readonly siteSettings = inject(SiteSettingsService);

  protected readonly saved = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    phoneNumber: ['', Validators.required],
    address: ['', Validators.required],
    restaurantHoursDays: ['', Validators.required],
    restaurantHoursText: ['', Validators.required],
  });

  constructor() {
    this.http.get<ApiSiteSettings>(`${environment.apiUrl}/settings`).subscribe((settings) => {
      this.form.reset(settings);
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saved.set(false);
    this.errorMessage.set(null);

    this.http
      .patch<ApiSiteSettings>(`${environment.apiUrl}/admin/settings`, this.form.getRawValue())
      .subscribe({
        next: (settings) => {
          this.saved.set(true);
          this.siteSettings.setSettings(settings);
        },
        error: () => this.errorMessage.set('Could not save settings.'),
      });
  }
}
