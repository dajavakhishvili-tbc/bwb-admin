import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Offer } from '../../offers.component';

@Component({
  selector: 'ib-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrl: './offer-card.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class OfferCardComponent {
  @Input() offer!: Offer;
  @Output() edit = new EventEmitter<Offer>();
  @Output() delete = new EventEmitter<number>();

  onEdit(): void {
    this.edit.emit(this.offer);
  }

  onDelete(): void {
    this.delete.emit(this.offer.id);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
} 