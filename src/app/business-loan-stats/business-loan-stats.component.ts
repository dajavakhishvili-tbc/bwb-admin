import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BusinessLoan {
  id: number;
  username: string;
  amount: number;
  currency: string;
  status: 'approved' | 'pending' | 'rejected' | 'completed';
  applicationDate: Date;
  loanType: string;
}

@Component({
  selector: 'ib-business-loan-stats',
  templateUrl: './business-loan-stats.component.html',
  styleUrl: './business-loan-stats.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class BusinessLoanStatsComponent {
  readonly loans = signal<BusinessLoan[]>([
    {
      id: 1,
      username: 'john_doe',
      amount: 50000,
      currency: 'USD',
      status: 'approved',
      applicationDate: new Date('2024-01-15'),
      loanType: 'Working Capital'
    },
    {
      id: 2,
      username: 'sarah_smith',
      amount: 75000,
      currency: 'EUR',
      status: 'pending',
      applicationDate: new Date('2024-01-14'),
      loanType: 'Equipment Financing'
    },
    {
      id: 3,
      username: 'mike_johnson',
      amount: 120000,
      currency: 'USD',
      status: 'completed',
      applicationDate: new Date('2024-01-10'),
      loanType: 'Commercial Real Estate'
    },
    {
      id: 4,
      username: 'lisa_wilson',
      amount: 35000,
      currency: 'GEL',
      status: 'rejected',
      applicationDate: new Date('2024-01-12'),
      loanType: 'Inventory Financing'
    },
    {
      id: 5,
      username: 'david_brown',
      amount: 90000,
      currency: 'EUR',
      status: 'approved',
      applicationDate: new Date('2024-01-13'),
      loanType: 'Business Expansion'
    },
    {
      id: 6,
      username: 'emma_davis',
      amount: 65000,
      currency: 'USD',
      status: 'pending',
      applicationDate: new Date('2024-01-11'),
      loanType: 'Debt Consolidation'
    },
    {
      id: 7,
      username: 'alex_garcia',
      amount: 180000,
      currency: 'GEL',
      status: 'completed',
      applicationDate: new Date('2024-01-08'),
      loanType: 'Commercial Real Estate'
    },
    {
      id: 8,
      username: 'maria_rodriguez',
      amount: 45000,
      currency: 'USD',
      status: 'approved',
      applicationDate: new Date('2024-01-09'),
      loanType: 'Working Capital'
    },
    {
      id: 9,
      username: 'james_miller',
      amount: 85000,
      currency: 'EUR',
      status: 'pending',
      applicationDate: new Date('2024-01-07'),
      loanType: 'Equipment Financing'
    },
    {
      id: 10,
      username: 'anna_taylor',
      amount: 55000,
      currency: 'GEL',
      status: 'completed',
      applicationDate: new Date('2024-01-06'),
      loanType: 'Business Expansion'
    }
  ]);

  // Filter signals
  readonly searchTerm = signal('');
  readonly statusFilter = signal<string>('');
  readonly currencyFilter = signal<string>('');
  readonly minAmount = signal<number | null>(null);
  readonly maxAmount = signal<number | null>(null);
  
  // Sort signals
  readonly sortBy = signal('applicationDate');
  readonly sortOrder = signal('desc');
  
  // Pagination signals
  readonly currentPage = signal(1);
  readonly itemsPerPage = signal(5);

  // UI state signals
  readonly isFiltersExpanded = signal(false);

  readonly filteredLoans = signal<BusinessLoan[]>([]);
  readonly totalPages = signal(1);

  // Computed signals for counts
  readonly approvedCompletedCount = computed(() => 
    this.loans().filter(l => l.status === 'approved' || l.status === 'completed').length
  );

  readonly pendingCount = computed(() => 
    this.loans().filter(l => l.status === 'pending').length
  );

  constructor() {
    this.updateFilteredLoans();
  }

  toggleFilters() {
    this.isFiltersExpanded.set(!this.isFiltersExpanded());
  }

  updateSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.currentPage.set(1);
    this.updateFilteredLoans();
  }

  updateStatusFilter(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.statusFilter.set(target.value);
    this.currentPage.set(1);
    this.updateFilteredLoans();
  }

  updateCurrencyFilter(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.currencyFilter.set(target.value);
    this.currentPage.set(1);
    this.updateFilteredLoans();
  }

  updateMinAmount(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value ? Number(target.value) : null;
    this.minAmount.set(value);
    this.currentPage.set(1);
    this.updateFilteredLoans();
  }

  updateMaxAmount(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value ? Number(target.value) : null;
    this.maxAmount.set(value);
    this.currentPage.set(1);
    this.updateFilteredLoans();
  }

  sortByColumn(column: string) {
    if (this.sortBy() === column) {
      // If already sorting by this column, toggle order
      this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
    } else {
      // If sorting by a new column, set it and default to ascending
      this.sortBy.set(column);
      this.sortOrder.set('asc');
    }
    this.updateFilteredLoans();
  }

  getSortIcon(column: string): string {
    if (this.sortBy() !== column) {
      return '↕️'; // Neutral arrow
    }
    return this.sortOrder() === 'asc' ? '↑' : '↓'; // Up or down arrow
  }

  updateFilteredLoans() {
    let filtered = this.loans().filter(loan => {
      // Name search filter
      const nameMatch = !this.searchTerm() || 
        loan.username.toLowerCase().includes(this.searchTerm().toLowerCase());
      
      // Status filter
      const statusMatch = !this.statusFilter() || 
        loan.status === this.statusFilter();
      
      // Currency filter
      const currencyMatch = !this.currencyFilter() || 
        loan.currency === this.currencyFilter();
      
      // Amount range filter
      const amountMatch = (!this.minAmount() || loan.amount >= this.minAmount()!) &&
                         (!this.maxAmount() || loan.amount <= this.maxAmount()!);
      
      return nameMatch && statusMatch && currencyMatch && amountMatch;
    });
    
    // Sort filtered loans
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy()) {
        case 'username':
          comparison = a.username.localeCompare(b.username);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'applicationDate':
          comparison = a.applicationDate.getTime() - b.applicationDate.getTime();
          break;
        default:
          comparison = 0;
      }
      
      return this.sortOrder() === 'desc' ? -comparison : comparison;
    });
    
    this.filteredLoans.set(filtered);
    this.totalPages.set(Math.ceil(filtered.length / this.itemsPerPage()));
  }

  paginatedLoans() {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    return this.filteredLoans().slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
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

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  getTotalAmount(): number {
    return this.loans().reduce((total, loan) => total + loan.amount, 0);
  }

  getApprovedAmount(): number {
    return this.loans()
      .filter(loan => loan.status === 'approved' || loan.status === 'completed')
      .reduce((total, loan) => total + loan.amount, 0);
  }

  getPendingAmount(): number {
    return this.loans()
      .filter(loan => loan.status === 'pending')
      .reduce((total, loan) => total + loan.amount, 0);
  }
} 