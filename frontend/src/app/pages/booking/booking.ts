import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { PageHero } from '../../shared/page-hero/page-hero';
import { DateRangePicker } from '../../shared/date-range-picker/date-range-picker';
import { Select } from '../../shared/select/select';
import { environment } from '../../../environments/environment';
import { LanguageService } from '../../i18n/language.service';
import { RoomKey } from '../../i18n/translations.model';
import { en } from '../../i18n/locales/en';

interface Room {
  id: string;
  name: string;
}

function isRoomKey(value: string): value is RoomKey {
  return value in en.rooms.items;
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
  protected readonly lang = inject(LanguageService);

  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
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
    const roomKeyParam = this.route.snapshot.queryParamMap.get('room');

    this.http.get<Room[]>(`${environment.apiUrl}/rooms`).subscribe({
      next: (rooms) => {
        this.availableRooms.set(rooms);
        if (roomKeyParam && isRoomKey(roomKeyParam)) {
          const englishName = en.rooms.items[roomKeyParam].name;
          const match = rooms.find((room) => room.name === englishName);
          if (match) {
            this.onRoomSelected(match.name);
          }
        }
      },
      error: () => this.availableRooms.set([]),
    });
  }

  // Reactive-forms control state (touched/invalid) isn't signal-based, so
  // these are plain methods rather than computed() — a computed would only
  // ever evaluate once, since it has no signal to react to.
  protected checkInHasError(): boolean {
    return this.form.controls.checkIn.touched && this.form.controls.checkIn.invalid;
  }

  protected checkOutHasError(): boolean {
    return this.form.controls.checkOut.touched && this.form.controls.checkOut.invalid;
  }

  protected roomHasError(): boolean {
    return this.form.controls.room.touched && this.form.controls.room.invalid;
  }

  protected nameHasError(): boolean {
    return this.form.controls.name.touched && this.form.controls.name.invalid;
  }

  protected emailHasError(): boolean {
    return this.form.controls.email.touched && this.form.controls.email.invalid;
  }

  protected phoneHasError(): boolean {
    return this.form.controls.phone.touched && this.form.controls.phone.invalid;
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
      this.scrollToFirstError();
      return;
    }
    this.submitError.set(null);
    this.showConfirm.set(true);
  }

  private scrollToFirstError(): void {
    const fieldOrder = ['checkIn', 'checkOut', 'room', 'name', 'email', 'phone'] as const;
    const firstInvalid = fieldOrder.find((name) => this.form.controls[name].invalid);
    if (!firstInvalid) return;

    // checkIn/checkOut share a single form-field wrapper (one date range picker).
    const target = firstInvalid === 'checkOut' ? 'checkIn' : firstInvalid;
    document
      .querySelector(`[data-field="${target}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  protected closeConfirm(): void {
    this.showConfirm.set(false);
  }

  protected confirmBooking(): void {
    const room = this.availableRooms().find((r) => r.name === this.form.controls.room.value);
    if (!room) {
      this.submitError.set(this.lang.t().booking.errors.roomUnavailable);
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
              : (message ?? this.lang.t().booking.errors.generic),
          );
        },
      });
  }
}
