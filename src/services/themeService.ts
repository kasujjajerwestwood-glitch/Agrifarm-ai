import { ThemeMode } from '../types';

export type ColorAccent =
  | 'emerald'
  | 'savannah'
  | 'amber'
  | 'teal'
  | 'indigo'
  | 'terracotta'
  | 'forest';

export interface AccentThemeOption {
  id: ColorAccent;
  name: string;
  dotColor: string;
  description: string;
}

export const ACCENT_THEMES: AccentThemeOption[] = [
  {
    id: 'emerald',
    name: 'Emerald Forest',
    dotColor: '#059669',
    description: 'Classic AgriFarm lush green foliage',
  },
  {
    id: 'savannah',
    name: 'Savannah Lime',
    dotColor: '#16a34a',
    description: 'High-contrast bright tropical savannah green',
  },
  {
    id: 'amber',
    name: 'Harvest Gold',
    dotColor: '#d97706',
    description: 'Warm earth, golden grains and ripe sunflowers',
  },
  {
    id: 'terracotta',
    name: 'Terracotta Soil',
    dotColor: '#c2410c',
    description: 'Rich red loam, fertile African soil and coffee clay',
  },
  {
    id: 'forest',
    name: 'Olive Grove',
    dotColor: '#4d7c0f',
    description: 'Deep olive, agroforestry and shade trees',
  },
  {
    id: 'teal',
    name: 'River Valley',
    dotColor: '#0d9488',
    description: 'Fresh irrigated riverbank & hydroponic tones',
  },
  {
    id: 'indigo',
    name: 'Agritech Blue',
    dotColor: '#4f46e5',
    description: 'Modern precision digital agritech contrast',
  },
];

class ThemeServiceImpl {
  private currentTheme: ThemeMode = 'light';
  private currentAccent: ColorAccent = 'emerald';
  private listeners: Array<(theme: ThemeMode, accent: ColorAccent) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('agrifarm_theme') as ThemeMode | null;
      const savedAccent = localStorage.getItem('agrifarm_accent') as ColorAccent | null;

      this.currentTheme = savedTheme || 'light';
      this.currentAccent = savedAccent || 'emerald';

      this.applyTheme(this.currentTheme);
      this.applyAccent(this.currentAccent);

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

  getColorAccent(): ColorAccent {
    return this.currentAccent;
  }

  setTheme(theme: ThemeMode): void {
    this.currentTheme = theme;
    if (typeof window !== 'undefined') {
      localStorage.setItem('agrifarm_theme', theme);
      this.applyTheme(theme);
    }
    this.notify();
  }

  setColorAccent(accent: ColorAccent): void {
    this.currentAccent = accent;
    if (typeof window !== 'undefined') {
      localStorage.setItem('agrifarm_accent', accent);
      this.applyAccent(accent);
    }
    this.notify();
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

  private applyAccent(accent: ColorAccent): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    ACCENT_THEMES.forEach((t) => root.classList.remove(`accent-${t.id}`));
    root.classList.add(`accent-${accent}`);
    root.setAttribute('data-accent', accent);
  }

  subscribe(listener: (theme: ThemeMode, accent: ColorAccent) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.currentTheme, this.currentAccent));
  }
}

export const ThemeService = new ThemeServiceImpl();
