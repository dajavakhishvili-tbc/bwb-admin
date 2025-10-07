import { Component, ChangeDetectionStrategy, signal, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Offer } from '../../offers.component';

@Component({
  selector: 'ib-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrl: './offer-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
  standalone: true
})
export class OfferCardComponent {
  readonly offer = input.required<Offer>();
  readonly edit = output<Offer>();
  readonly delete = output<number>();
  readonly showStats = output<Offer>();

  readonly isStatsOpen = signal(false);

  onEdit(): void {
    this.edit.emit(this.offer());
  }

  onDelete(): void {
    this.delete.emit(this.offer().id);
  }

  onShowStats(): void {
    this.showStats.emit(this.offer());
  }

} 