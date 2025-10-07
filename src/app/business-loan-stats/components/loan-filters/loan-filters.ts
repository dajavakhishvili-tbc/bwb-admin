import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ib-loan-filters',
  templateUrl: './loan-filters.html',
  styleUrls: ['./loan-filters.scss']
})
export class LoanFiltersComponent {
  isExpanded = input.required<boolean>();
  searchTerm = input.required<string>();
  statusFilter = input.required<string>();
  currencyFilter = input.required<string>();
  minAmount = input.required<number | null>();
  maxAmount = input.required<number | null>();

  toggleFilters = output<void>();
  searchChange = output<string>();
  statusFilterChange = output<string>();
  currencyFilterChange = output<string>();
  minAmountChange = output<number | null>();
  maxAmountChange = output<number | null>();

  onToggleFilters(): void {
    this.toggleFilters.emit();
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchChange.emit(target.value);
  }

  onStatusFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.statusFilterChange.emit(target.value);
  }

  onCurrencyFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.currencyFilterChange.emit(target.value);
  }

  onMinAmountChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value ? Number(target.value) : null;
    this.minAmountChange.emit(value);
  }

  onMaxAmountChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value ? Number(target.value) : null;
    this.maxAmountChange.emit(value);
  }
}