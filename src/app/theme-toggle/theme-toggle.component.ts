import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'ib-theme-toggle',
  template: `
    <button 
      (click)="toggleTheme()" 
      class="theme-toggle"
      [attr.aria-label]="'Switch to ' + (isDarkMode() ? 'light' : 'dark') + ' mode'"
      title="Toggle theme"
    >
      <div class="toggle-icon">
        @if (isDarkMode()) {
          <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        } @else {
          <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        }
      </div>
    </button>
  `,
  styles: [`
    .theme-toggle {
      background: var(--card-bg);
      border: 2px solid var(--border-color);
      border-radius: 50px;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px var(--shadow-color);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px var(--shadow-color);
        border-color: var(--button-primary);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
    
    .toggle-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      color: var(--text-primary);
      transition: all 0.3s ease;
    }
    
    .sun-icon, .moon-icon {
      width: 20px;
      height: 20px;
      transition: all 0.3s ease;
    }
    
    .sun-icon {
      color: #fbbf24;
    }
    
    .moon-icon {
      color: #6366f1;
    }
    
    .theme-toggle:hover .sun-icon {
      color: #f59e0b;
    }
    
    .theme-toggle:hover .moon-icon {
      color: #4f46e5;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class ThemeToggleComponent {
  readonly isDarkMode = signal(false);
  
  constructor(private themeService: ThemeService) {
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode.set(theme === 'dark');
    });
  }
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
} 