import { Component, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-select',
  imports: [],
  templateUrl: './select.html',
  styleUrl: './select.scss',
})
export class Select {
  readonly options = input<string[]>([]);
  readonly value = input<string>('');
  readonly placeholder = input<string>('Select an option');
  readonly valueChange = output<string>();

  protected readonly isOpen = signal(false);

  private readonly elementRef = inject(ElementRef<HTMLElement>);

  protected toggle(): void {
    this.isOpen.update((open) => !open);
  }

  protected selectOption(option: string): void {
    this.valueChange.emit(option);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }
}
