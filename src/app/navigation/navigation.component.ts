import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {  AuthService } from   '../login/auth.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { LayoutService } from '../core/layout.service';

@Component({
  selector: 'ib-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ThemeToggleComponent, RouterModule],
  standalone: true
})
export class NavigationComponent {
  readonly isBusinessLoanExpanded = signal(false);
  readonly isCollapsed = computed(() => this.layoutService.isNavigationCollapsed());

  public authService = inject(AuthService);
  public layoutService = inject(LayoutService);
  private router = inject(Router);

  toggleCollapse(): void {
    this.layoutService.toggleNavigation();
  }

  toggleBusinessLoanDropdown(): void {
    this.isBusinessLoanExpanded.update(expanded => !expanded);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
