import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'ib-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly totalUsers = signal(1250);
  readonly activeLoans = signal(89);
  readonly totalImages = signal(456);
} 