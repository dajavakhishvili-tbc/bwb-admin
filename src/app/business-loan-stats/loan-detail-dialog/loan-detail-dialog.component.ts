import { Component, Input, signal, computed, inject, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BusinessLoan } from '../business-loan-stats.component';

export interface StatusHistoryEntry {
  id: number;
  status: 'approved' | 'pending' | 'rejected' | 'completed';
  changedBy: string;
  changedAt: Date;
  comment?: string;
}

@Component({
  selector: 'ib-loan-detail-dialog',
  templateUrl: './loan-detail-dialog.component.html',
  styleUrl: './loan-detail-dialog.component.scss',
  imports: [DatePipe],
  standalone: true
})
export class LoanDetailDialogComponent {
  @Input() loan: BusinessLoan | null = null;
  readonly isOpen = input(false);
  readonly closeDialog = output<void>();

  readonly statusHistory = signal<StatusHistoryEntry[]>([
    {
      id: 1,
      status: 'pending',
      changedBy: 'System',
      changedAt: new Date('2024-01-15T10:30:00'),
      comment: 'Application submitted'
    },
    {
      id: 2,
      status: 'approved',
      changedBy: 'John Admin',
      changedAt: new Date('2024-01-16T14:20:00'),
      comment: 'Documents verified, loan approved'
    },
    {
      id: 3,
      status: 'completed',
      changedBy: 'System',
      changedAt: new Date('2024-01-20T09:15:00'),
      comment: 'Loan disbursed successfully'
    }
  ]);

  onClose() {
    // TODO: The 'emit' function requires a mandatory void argument
    this.closeDialog.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  }

  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }


  getStatusIcon(status: string): string {
    switch (status) {
      case 'approved':
        return '✅';
      case 'pending':
        return '⏳';
      case 'rejected':
        return '❌';
      case 'completed':
        return '🎉';
      default:
        return '📋';
    }
  }
} 