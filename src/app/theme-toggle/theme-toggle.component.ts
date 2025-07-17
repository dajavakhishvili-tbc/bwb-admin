import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Theme, ThemeService } from './theme.service';

@Component({
  selector: 'ib-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeToggleComponent {
  readonly themeService = inject(ThemeService);
  protected Theme = Theme;
}
