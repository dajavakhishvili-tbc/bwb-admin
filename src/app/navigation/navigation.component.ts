import { Component, ChangeDetectionStrategy, signal, effect } from '@angular/core';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'ib-navigation',
  imports: [RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  readonly isCollapsed = signal(false);
  
  readonly navItems: NavItem[] = [
    { label: 'Home', route: '/home', icon: '🏠' },
    { label: 'Images', route: '/images', icon: '🖼️' },
    { label: 'Texts', route: '/texts', icon: '📝' },
    { label: 'Posthog Events', route: '/events', icon: '📊' },
    { label: 'Business Loan', route: '/business-loan', icon: '💰' },
  ];
  
  constructor() {
    // Update CSS custom property when navigation state changes
    effect(() => {
      const navWidth = this.isCollapsed() ? '60px' : '220px';
      document.documentElement.style.setProperty('--nav-width', navWidth);
    });
  }
  
  toggleNavigation() {
    this.isCollapsed.set(!this.isCollapsed());
  }
} 