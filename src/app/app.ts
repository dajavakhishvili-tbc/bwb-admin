import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from './core/layout.service';
import { AuthService } from './login/auth.service';
import { NavigationComponent } from './navigation/navigation.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ib-root',
  imports: [RouterOutlet, NavigationComponent, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  public authService = inject(AuthService);
  public layoutService = inject(LayoutService);

  readonly isNavCollapsed = computed(() => this.layoutService.isNavigationCollapsed());

}
