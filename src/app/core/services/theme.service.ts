// theme.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private key = 'app_theme';
  private theme$ = new BehaviorSubject<Theme>(this.readInitial());

  get theme() {
    return this.theme$.asObservable();
  }

  toggle() {
    const next: Theme = this.theme$.value === 'light' ? 'dark' : 'light';
    this.set(next);
  }

  set(theme: Theme) {
    this.theme$.next(theme);
    try { localStorage.setItem(this.key, theme); } catch {}
    this.applyToBody(theme);
  }

  private readInitial(): Theme {
    try {
      const saved = localStorage.getItem(this.key) as Theme | null;
      return saved ?? 'light';
    } catch {
      return 'light';
    }
  }

  private applyToBody(theme: Theme) {
    document.body.classList.toggle('theme-dark', theme === 'dark');
    document.body.classList.toggle('theme-light', theme === 'light');
  }

  init() {
    // call once on app bootstrap to apply saved theme
    this.applyToBody(this.theme$.value);
  }
}
