import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';

export interface Loan {
  id: number;
  username: string;
  loanType: string;
  amount: number;
  currency: string;
  status: 'approved' | 'pending' | 'rejected' | 'completed';
  applicationDate: Date;
}

@Component({
  selector: 'ib-loans-table',
  imports: [DatePipe],
  templateUrl: './loans-table.html',
  styleUrls: ['./loans-table.scss']
})
export class LoansTableComponent {
  loans = input.required<Loan[]>();
  sortColumn = input.required<string>();
  sortDirection = input.required<string>();

  sort = output<string>();
  loanClick = output<Loan>();

  onSort(column: string): void {
    this.sort.emit(column);
  }

  onLoanClick(loan: Loan): void {
    this.loanClick.emit(loan);
  }

  getSortIcon(column: string): string {
    if (this.sortColumn() === column) {
      return this.sortDirection() === 'asc' ? '↑' : '↓';
    }
    return '';
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
}