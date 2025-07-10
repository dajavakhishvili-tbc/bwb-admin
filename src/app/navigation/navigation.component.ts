import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
}

@Component({
  selector: 'ib-navigation',
  imports: [RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  readonly navItems: NavItem[] = [
    { label: 'Home', route: '/home' },
    { label: 'Images', route: '/images' },
    { label: 'Business Loan', route: '/business-loan' },
  ];
} 