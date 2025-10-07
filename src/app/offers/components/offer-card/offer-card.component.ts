import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { Offer } from '../../offers.component';

@Component({
  selector: 'ib-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrl: './offer-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferCardComponent {
  @Input() offer!: Offer;
  @Output() edit = new EventEmitter<Offer>();
  @Output() delete = new EventEmitter<number>();
  @Output() showStats = new EventEmitter<Offer>();

  readonly isStatsOpen = signal(false);

  onEdit(): void {
    this.edit.emit(this.offer);
  }

  onDelete(): void {
    this.delete.emit(this.offer.id);
  }

  onShowStats(): void {
    this.showStats.emit(this.offer);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
} 