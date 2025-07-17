import {Injectable, signal} from '@angular/core';

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public themeMode = signal<Theme>(Theme.Light);

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? Theme.Dark : Theme.Light);
    this.setTheme(theme);
  }

  setTheme(theme: Theme): void {
    this.themeMode.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.updateCSSVariables(theme);
  }

  toggleTheme(): void {
    const newTheme = this.themeMode() === Theme.Light ? Theme.Dark : Theme.Light;
    this.setTheme(newTheme);
  }

  private updateCSSVariables(theme: Theme): void {
    const root = document.documentElement;

    if (theme === Theme.Dark) {
      root.style.setProperty('--bg-primary', '#1a1a1a');
      root.style.setProperty('--bg-secondary', '#2d2d2d');
      root.style.setProperty('--bg-tertiary', '#404040');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#b3b3b3');
      root.style.setProperty('--text-muted', '#808080');
      root.style.setProperty('--border-color', '#404040');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
      root.style.setProperty('--card-bg', '#2d2d2d');
      root.style.setProperty('--input-bg', '#404040');
      root.style.setProperty('--input-border', '#555555');
      root.style.setProperty('--button-primary', '#667eea');
      root.style.setProperty('--button-hover', '#5a6fd8');
      root.style.setProperty('--gradient-primary', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
      root.style.setProperty('--gradient-secondary', 'linear-gradient(135deg, #2d2d2d 0%, #404040 100%)');
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8f9fa');
      root.style.setProperty('--bg-tertiary', '#e9ecef');
      root.style.setProperty('--text-primary', '#333333');
      root.style.setProperty('--text-secondary', '#6c757d');
      root.style.setProperty('--text-muted', '#adb5bd');
      root.style.setProperty('--border-color', '#e1e5e9');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--card-bg', '#ffffff');
      root.style.setProperty('--input-bg', '#ffffff');
      root.style.setProperty('--input-border', '#e1e5e9');
      root.style.setProperty('--button-primary', '#667eea');
      root.style.setProperty('--button-hover', '#5a6fd8');
      root.style.setProperty('--gradient-primary', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
      root.style.setProperty('--gradient-secondary', 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)');
    }
  }
}
