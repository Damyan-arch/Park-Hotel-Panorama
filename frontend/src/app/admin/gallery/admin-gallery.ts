import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface AdminGalleryPhoto {
  id: string;
  imageUrl: string;
  altTextEn: string | null;
  sortOrder: number;
}

@Component({
  selector: 'app-admin-gallery',
  imports: [],
  templateUrl: './admin-gallery.html',
  styleUrl: './admin-gallery.scss',
})
export class AdminGallery {
  private readonly http = inject(HttpClient);
  private pendingInputEl: HTMLInputElement | null = null;

  protected readonly photos = signal<AdminGalleryPhoto[]>([]);
  protected readonly uploading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly pendingFile = signal<File | null>(null);
  protected readonly pendingPreviewUrl = signal<string | null>(null);

  constructor() {
    this.reload();
  }

  private reload(): void {
    this.http
      .get<AdminGalleryPhoto[]>(`${environment.apiUrl}/gallery`)
      .subscribe((photos) => this.photos.set(photos));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.pendingInputEl = input;
    this.errorMessage.set(null);
    this.pendingFile.set(file);
    this.pendingPreviewUrl.set(URL.createObjectURL(file));
  }

  cancelAdd(): void {
    this.clearPending();
  }

  confirmAdd(): void {
    const file = this.pendingFile();
    if (!file) return;

    this.uploading.set(true);
    this.errorMessage.set(null);

    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>(`${environment.apiUrl}/admin/uploads/gallery`, formData).subscribe({
      next: ({ url }) => {
        const sortOrder = this.photos().length;
        this.http.post(`${environment.apiUrl}/admin/gallery`, { imageUrl: url, sortOrder }).subscribe({
          next: () => {
            this.uploading.set(false);
            this.clearPending();
            this.reload();
          },
          error: () => {
            this.uploading.set(false);
            this.errorMessage.set('Could not save the new photo.');
          },
        });
      },
      error: () => {
        this.uploading.set(false);
        this.errorMessage.set('Image upload failed.');
      },
    });
  }

  private clearPending(): void {
    const previewUrl = this.pendingPreviewUrl();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    this.pendingFile.set(null);
    this.pendingPreviewUrl.set(null);
    if (this.pendingInputEl) {
      this.pendingInputEl.value = '';
      this.pendingInputEl = null;
    }
  }

  onAltChange(photo: AdminGalleryPhoto, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.http.patch(`${environment.apiUrl}/admin/gallery/${photo.id}`, { altTextEn: input.value }).subscribe();
  }

  remove(photo: AdminGalleryPhoto): void {
    if (!confirm('Delete this photo?')) return;

    this.http.delete(`${environment.apiUrl}/admin/gallery/${photo.id}`).subscribe({
      next: () => this.reload(),
      error: () => this.errorMessage.set('Could not delete this photo.'),
    });
  }
}
