import { ThemeMode } from '../types';

class ThemeServiceImpl {
  private currentTheme: ThemeMode = 'light';
  private listeners: Array<(theme: ThemeMode) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agrifarm_theme') as ThemeMode | null;
      this.currentTheme = saved || 'light';
      this.applyTheme(this.currentTheme);

      // Listen for system OS color scheme changes if system theme selected
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.currentTheme === 'system') {
          this.applyTheme('system');
        }
      });
    }
  }

  getTheme(): ThemeMode {
    return this.currentTheme;
  }

  setTheme(theme: ThemeMode): void {
    this.currentTheme = theme;
    if (typeof window !== 'undefined') {
      localStorage.setItem('agrifarm_theme', theme);
      this.applyTheme(theme);
    }
    this.listeners.forEach((cb) => cb(theme));
  }

  toggleTheme(): ThemeMode {
    const isDark = this.isCurrentlyDark();
    const newTheme: ThemeMode = isDark ? 'light' : 'dark';
    this.setTheme(newTheme);
    return newTheme;
  }

  isCurrentlyDark(): boolean {
    if (typeof window === 'undefined') return false;
    if (this.currentTheme === 'dark') return true;
    if (this.currentTheme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(theme: ThemeMode): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    let shouldBeDark = false;

    if (theme === 'dark') {
      shouldBeDark = true;
    } else if (theme === 'system') {
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (shouldBeDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  subscribe(listener: (theme: ThemeMode) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

export const ThemeService = new ThemeServiceImpl();
