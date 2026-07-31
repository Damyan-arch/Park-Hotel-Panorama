import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PageHero } from '../../shared/page-hero/page-hero';
import { DateRangePicker } from '../../shared/date-range-picker/date-range-picker';
import { Select } from '../../shared/select/select';
import { environment } from '../../../environments/environment';

interface Room {
  id: string;
  name: string;
}

function toLocalIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

@Component({
  selector: 'app-booking',
  imports: [PageHero, ReactiveFormsModule, DateRangePicker, Select],
  templateUrl: './booking.html',
  styleUrl: './booking.scss',
})
export class Booking {
  private readonly http = inject(HttpClient);
  private readonly fb = new FormBuilder();

  protected readonly availableRooms = signal<Room[]>([]);
  protected readonly roomNames = computed(() => this.availableRooms().map((room) => room.name));

  protected readonly submitted = signal(false);
  protected readonly showConfirm = signal(false);
  protected readonly submitting = signal(false);
  protected readonly submitError = signal<string | null>(null);
  protected readonly todayIso = toLocalIso(new Date());

  protected readonly form = this.fb.nonNullable.group({
    checkIn: ['', Validators.required],
    checkOut: ['', Validators.required],
    room: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
  });

  constructor() {
    this.http.get<Room[]>(`${environment.apiUrl}/rooms`).subscribe({
      next: (rooms) => this.availableRooms.set(rooms),
      error: () => this.availableRooms.set([]),
    });
  }

  protected onCheckInSelected(iso: string): void {
    this.form.controls.checkIn.setValue(iso);
    this.form.controls.checkIn.markAsTouched();
  }

  protected onCheckOutSelected(iso: string): void {
    this.form.controls.checkOut.setValue(iso);
    this.form.controls.checkOut.markAsTouched();
  }

  protected onRoomSelected(room: string): void {
    this.form.controls.room.setValue(room);
    this.form.controls.room.markAsTouched();
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitError.set(null);
    this.showConfirm.set(true);
  }

  protected closeConfirm(): void {
    this.showConfirm.set(false);
  }

  protected confirmBooking(): void {
    const room = this.availableRooms().find((r) => r.name === this.form.controls.room.value);
    if (!room) {
      this.submitError.set('That room is no longer available. Please pick another one.');
      this.showConfirm.set(false);
      return;
    }

    this.showConfirm.set(false);
    this.submitting.set(true);

    this.http
      .post(`${environment.apiUrl}/reservations`, {
        roomId: room.id,
        checkIn: this.form.controls.checkIn.value,
        checkOut: this.form.controls.checkOut.value,
        fullName: this.form.controls.name.value,
        email: this.form.controls.email.value,
        phone: this.form.controls.phone.value,
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.submitted.set(true);
        },
        error: (error: { error?: { message?: string | string[] } }) => {
          this.submitting.set(false);
          const message = error.error?.message;
          this.submitError.set(
            Array.isArray(message)
              ? message.join(' ')
              : (message ?? 'Something went wrong sending your request. Please try again.'),
          );
        },
      });
  }
}
