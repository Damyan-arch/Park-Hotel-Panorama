import { Component, ElementRef, HostListener, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import { Locale } from '../../i18n/translations.model';

@Component({
  selector: 'app-language-switcher',
  imports: [],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
})
export class LanguageSwitcher {
  protected readonly lang = inject(LanguageService);
  protected readonly isOpen = signal(false);

  protected readonly currentFlagUrl = computed(
    () => this.lang.options.find((option) => option.code === this.lang.locale())?.flagUrl ?? '',
  );

  private readonly elementRef = inject(ElementRef<HTMLElement>);

  protected toggle(): void {
    this.isOpen.update((open) => !open);
  }

  protected isSelected(locale: Locale): boolean {
    return locale === this.lang.locale();
  }

  protected select(locale: Locale): void {
    this.lang.setLocale(locale);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }
}
