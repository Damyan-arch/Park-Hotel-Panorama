import { Component, computed, input, output, signal } from '@angular/core';

interface CalendarDay {
  iso: string;
  day: number;
  inCurrentMonth: boolean;
  isPast: boolean;
  isToday: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isRangeMiddle: boolean;
  isSingleSelection: boolean;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function toIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseIso(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

@Component({
  selector: 'app-date-range-picker',
  imports: [],
  templateUrl: './date-range-picker.html',
  styleUrl: './date-range-picker.scss',
})
export class DateRangePicker {
  readonly minIso = input<string | null>(null);
  readonly checkIn = input<string>('');
  readonly checkOut = input<string>('');
  readonly checkInChange = output<string>();
  readonly checkOutChange = output<string>();

  private readonly today = toIso(new Date());
  private readonly initialDate =
    parseIso(this.checkIn()) ?? parseIso(this.minIso()) ?? new Date();

  protected readonly viewYear = signal(this.initialDate.getFullYear());
  protected readonly viewMonth = signal(this.initialDate.getMonth());
  protected readonly weekdayNames = WEEKDAY_NAMES;

  protected readonly monthLabel = computed(
    () => `${MONTH_NAMES[this.viewMonth()]} ${this.viewYear()}`,
  );

  protected readonly weeks = computed<CalendarDay[][]>(() => {
    const year = this.viewYear();
    const month = this.viewMonth();
    const minIso = this.minIso() ?? this.today;
    const checkIn = this.checkIn();
    const checkOut = this.checkOut();
    const hasRange = !!(checkIn && checkOut);

    const firstOfMonth = new Date(year, month, 1);
    const startOffset = (firstOfMonth.getDay() + 6) % 7; // 0 = Monday
    const gridStart = new Date(year, month, 1 - startOffset);

    const days: CalendarDay[] = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(
        gridStart.getFullYear(),
        gridStart.getMonth(),
        gridStart.getDate() + i,
      );
      const iso = toIso(date);
      days.push({
        iso,
        day: date.getDate(),
        inCurrentMonth: date.getMonth() === month,
        isPast: iso < minIso,
        isToday: iso === this.today,
        isRangeStart: iso === checkIn,
        isRangeEnd: hasRange && iso === checkOut,
        isRangeMiddle: hasRange && iso > checkIn && iso < checkOut,
        isSingleSelection: iso === checkIn && !hasRange,
      });
    }

    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    while (weeks.length > 5 && weeks[weeks.length - 1].every((d) => !d.inCurrentMonth)) {
      weeks.pop();
    }
    return weeks;
  });

  protected prevMonth(): void {
    const month = this.viewMonth();
    if (month === 0) {
      this.viewMonth.set(11);
      this.viewYear.update((year) => year - 1);
    } else {
      this.viewMonth.set(month - 1);
    }
  }

  protected nextMonth(): void {
    const month = this.viewMonth();
    if (month === 11) {
      this.viewMonth.set(0);
      this.viewYear.update((year) => year + 1);
    } else {
      this.viewMonth.set(month + 1);
    }
  }

  protected selectDay(day: CalendarDay): void {
    if (day.isPast) return;

    const checkIn = this.checkIn();
    const checkOut = this.checkOut();

    if (!checkIn || checkOut) {
      // no active selection, or a full range is already set: start over
      this.checkInChange.emit(day.iso);
      this.checkOutChange.emit('');
      return;
    }

    if (day.iso > checkIn) {
      this.checkOutChange.emit(day.iso);
    } else if (day.iso < checkIn) {
      this.checkInChange.emit(day.iso);
    } else {
      this.checkInChange.emit('');
    }
  }
}
