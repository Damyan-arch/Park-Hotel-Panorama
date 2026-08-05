import { Component, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

type RoomType = 'SINGLE' | 'DOUBLE' | 'SUITE' | 'FAMILY';

interface AdminRoom {
  id: string;
  name: string;
  type: RoomType;
  description: string | null;
  capacity: number;
  sizeSqm: number | null;
  basePricePerNight: string;
  currency: string;
  imageUrls: string[] | null;
  isActive: boolean;
}

@Component({
  selector: 'app-admin-rooms',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-rooms.html',
  styleUrl: './admin-rooms.scss',
})
export class AdminRooms {
  private readonly http = inject(HttpClient);
  private readonly fb = new FormBuilder();

  protected readonly roomTypes: RoomType[] = ['SINGLE', 'DOUBLE', 'SUITE', 'FAMILY'];
  protected readonly rooms = signal<AdminRoom[]>([]);
  protected readonly editingId = signal<string | null>(null);
  protected readonly isCreating = signal(false);
  protected readonly uploading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly imageUrls = signal<string[]>([]);

  protected readonly isEditorOpen = computed(() => this.isCreating() || this.editingId() !== null);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    type: ['DOUBLE' as RoomType, Validators.required],
    description: [''],
    capacity: [2, [Validators.required, Validators.min(1)]],
    sizeSqm: [null as number | null],
    basePricePerNight: ['', Validators.required],
    isActive: [true],
  });

  constructor() {
    this.reload();
  }

  private reload(): void {
    this.http
      .get<AdminRoom[]>(`${environment.apiUrl}/admin/rooms`)
      .subscribe((rooms) => this.rooms.set(rooms));
  }

  startCreate(): void {
    this.editingId.set(null);
    this.isCreating.set(true);
    this.errorMessage.set(null);
    this.form.reset({
      name: '',
      type: 'DOUBLE',
      description: '',
      capacity: 2,
      sizeSqm: null,
      basePricePerNight: '',
      isActive: true,
    });
    this.imageUrls.set([]);
  }

  startEdit(room: AdminRoom): void {
    this.isCreating.set(false);
    this.editingId.set(room.id);
    this.errorMessage.set(null);
    this.form.reset({
      name: room.name,
      type: room.type,
      description: room.description ?? '',
      capacity: room.capacity,
      sizeSqm: room.sizeSqm,
      basePricePerNight: room.basePricePerNight,
      isActive: room.isActive,
    });
    this.imageUrls.set(room.imageUrls ?? []);
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.isCreating.set(false);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploading.set(true);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>(`${environment.apiUrl}/admin/uploads/rooms`, formData).subscribe({
      next: ({ url }) => {
        this.imageUrls.set([...this.imageUrls(), url]);
        this.uploading.set(false);
        input.value = '';
      },
      error: () => {
        this.uploading.set(false);
        this.errorMessage.set('Image upload failed.');
      },
    });
  }

  removeImage(url: string): void {
    this.imageUrls.set(this.imageUrls().filter((existing) => existing !== url));
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = { ...this.form.getRawValue(), imageUrls: this.imageUrls() };
    this.errorMessage.set(null);

    const editingId = this.editingId();
    const request = editingId
      ? this.http.patch(`${environment.apiUrl}/admin/rooms/${editingId}`, payload)
      : this.http.post(`${environment.apiUrl}/admin/rooms`, payload);

    request.subscribe({
      next: () => {
        this.cancelEdit();
        this.reload();
      },
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage.set(error.error?.message ?? 'Something went wrong.');
      },
    });
  }

  remove(room: AdminRoom): void {
    if (!confirm(`Delete "${room.name}"?`)) return;

    this.http.delete(`${environment.apiUrl}/admin/rooms/${room.id}`).subscribe({
      next: () => this.reload(),
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage.set(error.error?.message ?? 'Could not delete this room.');
      },
    });
  }
}
