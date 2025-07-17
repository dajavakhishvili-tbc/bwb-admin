import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {  AuthService } from   '../login/auth.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'ib-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ThemeToggleComponent, RouterModule],
  standalone: true
})
export class NavigationComponent {
  readonly isCollapsed = signal(false);

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  toggleCollapse(): void {
    this.isCollapsed.set(!this.isCollapsed());
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
