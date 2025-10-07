import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { Offer } from '../../offers.component';

@Component({
  selector: 'ib-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrl: './offer-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe]
})
export class OfferCardComponent {
  readonly offer = input.required<Offer>();
  readonly edit = output<Offer>();
  readonly delete = output<number>();
  readonly showStats = output<Offer>();

  readonly isStatsOpen = signal(false);

  readonly dateStatus = computed(() => {
    const offer = this.offer();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = offer.startDate ? new Date(offer.startDate) : null;
    const endDate = offer.endDate ? new Date(offer.endDate) : null;
    
    if (startDate) {
      startDate.setHours(0, 0, 0, 0);
    }
    if (endDate) {
      endDate.setHours(0, 0, 0, 0);
    }

    // If no dates provided, return null
    if (!startDate && !endDate) {
      return null;
    }

    // If both start and end dates are today
    if (startDate && endDate && this.isSameDate(startDate, today) && this.isSameDate(endDate, today)) {
      return { text: 'Today only', type: 'today-only', backgroundColor: '#F9F5FF' };
    }

    // If offer hasn't started yet
    if (startDate && startDate > today) {
      const daysUntilStart = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilStart === 1) {
        return { text: 'Starts tomorrow', type: 'starts-soon', backgroundColor: '#F0FDF4' };
      } else {
        const formattedDate = this.formatDate(startDate);
        return { text: `Starts at ${formattedDate}`, type: 'starts-later', backgroundColor: '#FEF3C7' };
      }
    }

    // If offer is active (started or no start date)
    if (endDate) {
      const daysUntilEnd = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      // If expires today
      if (daysUntilEnd === 0) {
        return { text: 'Expires today', type: 'expires-today', backgroundColor: '#F9F5FF' };
      }
      
      // If expires in less than a week
      if (daysUntilEnd < 7) {
        return { text: `Expires in ${daysUntilEnd} days`, type: 'expires-soon', backgroundColor: '#FEF2F2' };
      }
      
      // If expires in exactly a week
      if (daysUntilEnd === 7) {
        return { text: 'Expires in 1 week', type: 'expires-week', backgroundColor: '#FEF2F2' };
      }
      
      // If expires in more than a week
      const formattedDate = this.formatDate(endDate);
      return { text: `Expires at ${formattedDate}`, type: 'expires-later', backgroundColor: '#F0F9FF' };
    }

    // If only start date and it's today or past
    if (startDate && startDate <= today) {
      return { text: 'Active now', type: 'active', backgroundColor: '#F0FDF4' };
    }

    return null;
  });

  private isSameDate(date1: Date, date2: Date): boolean {
    return date1.getTime() === date2.getTime();
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

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