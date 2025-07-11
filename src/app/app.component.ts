import { Component, ChangeDetectionStrategy, signal, effect } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'ib-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  template: `
    @if (authService.isAuthenticated()) {
      <div class="ib-app-layout">
        <ib-navigation />
        <div class="ib-app-content">
          <router-outlet />
        </div>
      </div>
    } @else {
      <router-outlet />
    }
  `,
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    // Redirect to login if not authenticated and not already on login page
    effect(() => {
      if (!this.authService.isAuthenticated() && this.router.url !== '/login') {
        this.router.navigate(['/login']);
      }
    });
  }
} 